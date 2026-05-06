'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { Era, Kingdom } from '@/data/mapaData';
import medGeoDataHighRes from '@/data/mediterranean_highres.json';

interface MapaInteractivoProps {
  era: Era;
  activeKingdom: Kingdom | null;
  onSelectKingdom: (kingdom: Kingdom) => void;
}

const modernRegions = [
  { name: 'Peloponeso', coords: [22.2, 37.6] as [number, number] },
  { name: 'Ática', coords: [23.9, 38.0] as [number, number] },
  { name: 'Creta', coords: [24.9, 35.2] as [number, number] },
  { name: 'Tesalia', coords: [22.3, 39.5] as [number, number] },
  { name: 'Beocia', coords: [23.1, 38.4] as [number, number] },
  { name: 'Macedonia', coords: [22.5, 40.5] as [number, number] },
  { name: 'Jonia', coords: [27.5, 38.5] as [number, number] },
  { name: 'Magna Grecia', coords: [16.5, 39.0] as [number, number] },
];

export default function MapaInteractivo({ era, activeKingdom, onSelectKingdom }: MapaInteractivoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const mapGroupRef = useRef<SVGGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const initializedRef = useRef(false);
  const currentZoomRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !mapGroupRef.current || dimensions.width === 0) return;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 15])
      .on('zoom', (event) => {
        const { k } = event.transform;
        currentZoomRef.current = event.transform;
        
        d3.select(mapGroupRef.current).attr('transform', event.transform.toString());
        
        const g = d3.select(mapGroupRef.current);
        g.selectAll('.country-label').attr('font-size', `${14 / k}px`);
        g.selectAll('.sea-label-main').attr('font-size', `${24 / k}px`);
        g.selectAll('.sea-label-sub').attr('font-size', `${18 / k}px`);
        g.selectAll('.region-label').attr('font-size', `${16 / k}px`);
        
        // Escalar inversamente los contenedores para que mantengan su tamaño real en pantalla
        g.selectAll('.icon-scaler').attr('transform', `scale(${1 / k})`);
        g.selectAll('.label-scaler').attr('transform', `scale(${1 / k})`);
      });

    zoomBehaviorRef.current = zoom;
    const svg = d3.select(svgRef.current);
    svg.call(zoom);

    if (!initializedRef.current) {
       svg.call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1));
       initializedRef.current = true;
    }
  }, [dimensions.width]);

  const isDesktop = dimensions.width > 768;
  const mapCenterX = isDesktop ? dimensions.width / 2 - 150 : dimensions.width / 2;

  // Centro movido a [23.5, 38.0] y escala ajustada para ver desde Siracusa hasta Turquía
  const projection = dimensions.width > 0 ? d3.geoMercator()
    .center([23.5, 38.0])
    .translate([mapCenterX, dimensions.height / 2])
    .scale(dimensions.width * 2.8) : null; 

  const centerOnKingdom = (kingdom: Kingdom) => {
    onSelectKingdom(kingdom);
    
    if (!svgRef.current || !zoomBehaviorRef.current || !projection) return;
    
    const [x, y] = projection(kingdom.coordinates) || [0, 0];
    if (x === 0 && y === 0) return;

    const targetScale = Math.max(currentZoomRef.current.k, 4); // Hacer un zoom decente para ver detalle
    
    // Calcular la traslación para centrar [x, y] en la pantalla
    // Si es desktop, el centro visual está desplazado por el panel
    const centerX = isDesktop ? dimensions.width / 2 - 150 : dimensions.width / 2;
    const centerY = dimensions.height / 2;

    const tx = centerX - x * targetScale;
    const ty = centerY - y * targetScale;

    d3.select(svgRef.current)
      .transition()
      .duration(1000)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity.translate(tx, ty).scale(targetScale));
  };
    
  // Re-aplicar la escala inversa cuando React re-renderiza los nodos (ej. al clickar un reino)
  useEffect(() => {
    if (!mapGroupRef.current) return;
    const k = currentZoomRef.current.k;
    const g = d3.select(mapGroupRef.current);
    g.selectAll('.icon-scaler').attr('transform', `scale(${1 / k})`);
    g.selectAll('.label-scaler').attr('transform', `scale(${1 / k})`);
  }, [activeKingdom, era]);
    
  const pathGenerator = projection ? d3.geoPath().projection(projection) : null;

  // Union of all land for clipping territories (so kingdoms expand into Asia Minor, but not Africa)
  const landClipPathDef = useMemo(() => {
    if (!pathGenerator) return '';
    
    // Si hay reinos en el occidente (longitud < 19, como Magna Grecia/Siracusa), incluimos Italia.
    // Si no, la excluimos para que reinos occidentales de Grecia (como Ítaca) no se expandan hasta Italia.
    const hasItalianColonies = era.kingdoms.some(k => k.coordinates[0] < 19);
    
    const validCountries = ['Greece', 'Turkey', 'Albania', 'Macedonia', 'Bulgaria', 'Cyprus'];
    if (hasItalianColonies) validCountries.push('Italy');
    
    const paths = (medGeoDataHighRes as any).features
      .filter((f: any) => validCountries.includes(f.properties.ADMIN))
      .map((f: any) => pathGenerator(f) || '');
    return paths.join(' ');
  }, [pathGenerator, era]);

  // Calculate clustered Voronoi territories
  const territoryPaths = useMemo(() => {
    if (!projection || dimensions.width === 0 || era.kingdoms.length === 0) return [];
    
    // Flatten all points (main + anchors) with reference to their kingdom index
    const flatPoints: {x: number, y: number, kIndex: number}[] = [];
    
    era.kingdoms.forEach((k, i) => {
      // Las batallas y santuarios no generan territorio Voronoi, son solo puntos de interés
      if (k.type === 'battle' || k.type === 'sanctuary') return;
      
      const allCoords = [k.coordinates, ...(k.anchorPoints || [])];
      allCoords.forEach(coord => {
        const p = projection(coord);
        if (p) {
          flatPoints.push({ x: p[0], y: p[1], kIndex: i });
        }
      });
    });

    // Puntos neutrales para acorralar a los reinos costeros (como Troya o Mileto) 
    // y evitar que dominen todo el interior de continentes gigantes como Turquía o Italia.
    const neutralCoords = [
      // Turquía Interior (acorrala a Troya, Mileto, Éfeso)
      [28.5, 40.0], [29.5, 39.5], [28.0, 38.5], [29.0, 38.0], [28.5, 37.0], [30.0, 39.0], [32.0, 38.0],
      // Italia Central y Norte (acorrala a Siracusa)
      [14.0, 42.0], [13.0, 43.0], [11.0, 44.5], [15.5, 40.5],
      // Balcanes Norte (acorrala Macedonia/Tracia)
      [21.5, 42.0], [23.5, 42.5], [25.5, 42.5]
    ];
    neutralCoords.forEach(coord => {
      const p = projection(coord as [number, number]);
      if (p) flatPoints.push({ x: p[0], y: p[1], kIndex: -1 });
    });
    
    const delaunay = d3.Delaunay.from(flatPoints.map(p => [p.x, p.y]));
    const voronoi = delaunay.voronoi([-5000, -5000, dimensions.width + 5000, dimensions.height + 5000]);
    
    // Group cells back into kingdoms
    const pathsByIndex: string[] = new Array(era.kingdoms.length).fill('');
    flatPoints.forEach((p, i) => {
      if (p.kIndex >= 0) {
        const cellPath = voronoi.renderCell(i);
        pathsByIndex[p.kIndex] += cellPath + ' ';
      }
    });
    
    return pathsByIndex;
  }, [era, projection, dimensions]);

  const renderIcon = (type: string, isSelected: boolean) => {
    switch(type) {
      case 'battle':
        // Rombo rotado (como en la leyenda) centrado en 0,0 - Tamaño intermedio
        return (
          <rect 
            x="-3.5" y="-3.5" width="7" height="7" 
            transform="rotate(45)"
            fill="none" 
            stroke={isSelected ? "#FFF" : "#F87171"} 
            strokeWidth="2" 
            className="poi-icon drop-shadow-md" 
          />
        );
      case 'sanctuary':
        // Centrado en 0,0: Triángulo equilátero aproximado
        return (
          <polygon 
            points="0,-8 7,6 -7,6" 
            fill={isSelected ? "#FFF" : "#FACC15"} 
            stroke="#1A1A24" 
            strokeWidth="1" 
            className="poi-icon drop-shadow-md" 
          />
        );
      case 'empire':
      case 'palace':
        return (
          <rect x="-6" y="-6" width="12" height="12" fill={isSelected ? "#FFF" : "#D4AF37"} stroke="#1A1A24" strokeWidth="1.5" rx="2" className="poi-icon kingdom-core drop-shadow-lg" />
        );
      case 'colony':
      case 'polis':
      default:
        return (
          <circle r={5} fill={isSelected ? "#FFF" : "#D4AF37"} stroke="#1A1A24" strokeWidth="1.5" className="poi-icon kingdom-core drop-shadow-lg" />
        );
    }
  }

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'empire': return 'Imperio';
      case 'palace': return 'Palacio / Fortaleza';
      case 'polis': return 'Polis (Ciudad-Estado)';
      case 'colony': return 'Colonia';
      case 'sanctuary': return 'Santuario Sagrado';
      case 'battle': return 'Batalla Histórica';
      case 'region': return 'Región / Liga';
      default: return 'Asentamiento';
    }
  };

  return (
    <div className="absolute inset-0 z-0 bg-[#04060A] cursor-grab active:cursor-grabbing overscroll-none touch-none" ref={containerRef}>
      {dimensions.width === 0 || !projection || !pathGenerator ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="absolute bottom-6 left-6 z-10 text-text-muted text-xs font-display tracking-widest pointer-events-none opacity-50">
            Usa el ratón para mover y hacer zoom
          </div>

          <div className="absolute top-20 left-4 z-20 bg-black/70 backdrop-blur-md border border-gold/20 rounded-xl p-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gold/30 scrollbar-track-transparent" style={{ minWidth: '180px', maxWidth: '240px' }}>
            <h3 className="text-gold font-display text-xs tracking-[0.2em] uppercase mb-2 border-b border-gold/20 pb-1">Leyenda</h3>
            <div className="flex flex-col gap-1">
              {era.kingdoms.map((kingdom) => (
                <button
                  key={kingdom.id}
                  onClick={() => centerOnKingdom(kingdom)}
                  className={`flex items-center gap-3 px-2 py-2 rounded-md text-left transition-all duration-200 hover:bg-white/10 cursor-pointer ${
                    activeKingdom?.id === kingdom.id ? 'bg-white/15 ring-1 ring-gold/50' : ''
                  }`}
                >
                  <span
                    className={`w-3 h-3 flex-shrink-0 border border-white/20 ${kingdom.type === 'battle' ? 'rotate-45' : kingdom.type === 'empire' || kingdom.type === 'palace' ? 'rounded-sm' : kingdom.type === 'sanctuary' ? '' : 'rounded-full'}`}
                    style={{ 
                      backgroundColor: kingdom.type === 'battle' ? 'transparent' : kingdom.color, 
                      borderColor: kingdom.type === 'battle' ? kingdom.color : 'rgba(255,255,255,0.2)', 
                      borderWidth: kingdom.type === 'battle' ? '2px' : '1px',
                      clipPath: kingdom.type === 'sanctuary' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
                    }}
                  />
                  <div className="flex flex-col">
                    <span className={`text-[11px] font-display tracking-wide leading-tight ${
                      activeKingdom?.id === kingdom.id ? 'text-white font-bold' : 'text-white/80'
                    }`}>
                      {kingdom.name}
                    </span>
                    <span className="text-[9px] text-gold/70 uppercase tracking-widest mt-0.5 font-light">
                      {getTypeLabel(kingdom.type)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="w-full h-full overflow-hidden">
            <defs>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(212, 175, 55, 0.6)" />
                <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
              </radialGradient>
              
              {/* Organic/Jagged border filter */}
              <filter id="displacementFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              
              <clipPath id="all-land-clip">
                <path d={landClipPathDef} />
              </clipPath>
            </defs>

            <g ref={mapGroupRef}>
              {/* Base Map - Mediterranean Context */}
              {medGeoDataHighRes.features.map((feature: any, i: number) => {
                const hasItalianColonies = era.kingdoms.some(k => k.coordinates[0] < 19);
                const isGreeceOrCoast = ['Greece', 'Turkey', 'Albania', 'Macedonia', 'Bulgaria', 'Cyprus'].includes(feature.properties.ADMIN) || (hasItalianColonies && feature.properties.ADMIN === 'Italy');
                const centroid = pathGenerator.centroid(feature);
                
                return (
                  <g key={`base-${i}`}>
                    <path
                      d={pathGenerator(feature) || ''}
                      fill={isGreeceOrCoast ? "rgba(25, 30, 40, 0.9)" : "rgba(12, 15, 20, 0.6)"}
                      stroke={isGreeceOrCoast ? "rgba(212, 175, 55, 0.15)" : "rgba(212, 175, 55, 0.05)"}
                      strokeWidth={isGreeceOrCoast ? 1.5 : 1}
                      vectorEffect="non-scaling-stroke"
                    />
                    {!isGreeceOrCoast && !isNaN(centroid[0]) && (
                      <text
                        x={centroid[0]}
                        y={centroid[1]}
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.15)"
                        fontSize="14px"
                        className="country-label font-display tracking-[0.2em] uppercase pointer-events-none select-none"
                        style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.8)' }}
                      >
                        {feature.properties.ADMIN === 'Egypt' ? 'Egipto' : 
                         feature.properties.ADMIN === 'Libya' ? 'Libia' : feature.properties.ADMIN}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Voronoi Territories Clipped to all Land and Filtered for organic borders */}
              <g clipPath="url(#all-land-clip)" filter="url(#displacementFilter)">
                {era.kingdoms.map((kingdom, i) => {
                  const isActive = activeKingdom?.id === kingdom.id;
                  const isDimmed = activeKingdom && !isActive;
                  
                  return (
                    <path
                      key={`territory-${kingdom.id}`}
                      d={territoryPaths[i] || ''}
                      fill={kingdom.color}
                      opacity={isActive ? 0.6 : (isDimmed ? 0.05 : 0.35)}
                      className="transition-all duration-700 ease-in-out cursor-pointer hover:opacity-50"
                      stroke={kingdom.color}
                      strokeWidth={2} // Using thick stroke of same color to hide internal voronoi lines
                      strokeOpacity={0.8}
                      vectorEffect="non-scaling-stroke"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectKingdom(kingdom);
                      }}
                    />
                  );
                })}
              </g>

              {/* Sea Labels */}
              <text x={projection([19, 35])?.[0]} y={projection([19, 35])?.[1]} textAnchor="middle" fill="rgba(100,150,255,0.1)" fontSize="24px" className="sea-label-main font-display italic tracking-[0.3em] pointer-events-none select-none">
                MAR MEDITERRÁNEO
              </text>
              <text x={projection([25.5, 37.5])?.[0]} y={projection([25.5, 37.5])?.[1]} textAnchor="middle" fill="rgba(100,150,255,0.15)" fontSize="18px" className="sea-label-sub font-display italic tracking-[0.3em] pointer-events-none select-none">
                MAR EGEO
              </text>

              {/* Modern Region Labels */}
              {modernRegions.map((region, i) => {
                const pos = projection(region.coords);
                if (!pos) return null;
                return (
                  <text
                    key={`region-${i}`}
                    x={pos[0]}
                    y={pos[1]}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.2)"
                    fontSize="16px"
                    className="region-label font-display tracking-[0.4em] uppercase pointer-events-none select-none"
                    style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.8)' }}
                  >
                    {region.name}
                  </text>
                );
              })}

              {/* Nodes for Kingdoms */}
              <AnimatePresence>
                {era.kingdoms.map((kingdom) => {
                  const [x, y] = projection(kingdom.coordinates) || [0, 0];
                  const isSelected = activeKingdom?.id === kingdom.id;

                  return (
                    <g key={`${era.id}-${kingdom.id}`} transform={`translate(${x}, ${y})`}>
                      <motion.g
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="cursor-pointer group"
                        onClick={(e) => {
                          e.stopPropagation();
                          centerOnKingdom(kingdom);
                        }}
                      >
                        {/* Escalar dinámicamente para mantener tamaño constante */}
                        <g className="icon-scaler">
                          {/* Área de impacto invisible para facilitar el click (20px fijos en pantalla) */}
                          <circle r={20} fill="transparent" />
                          
                          {isSelected && (
                            <circle r={15} fill="url(#glow)" className="kingdom-pulse animate-pulse" />
                          )}
                          
                          <circle
                            r={12}
                            fill="none"
                            stroke="rgba(212, 175, 55, 0.5)"
                            strokeWidth={1}
                            vectorEffect="non-scaling-stroke"
                            className={`kingdom-hover transition-all duration-300 ${isSelected ? 'scale-150 opacity-0' : 'group-hover:scale-150 group-hover:opacity-0'}`}
                          />

                          {renderIcon(kingdom.type, isSelected)}
                        </g>
                        
                        <g className="label-scaler">
                          <text
                            y={-18}
                            textAnchor="middle"
                            fontSize="12px"
                            className={`
                              kingdom-label font-display tracking-widest uppercase transition-all duration-300 pointer-events-none select-none
                              ${isSelected ? 'fill-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)]' : 'fill-gold-light/90 group-hover:fill-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'}
                            `}
                          >
                            {kingdom.name}
                          </text>
                        </g>
                      </motion.g>
                    </g>
                  );
                })}
              </AnimatePresence>
            </g>
          </svg>

          {/* Sombra superior para contraste de la UI externa (Selector de Época) - Colocado después del SVG para garantizar que renderice por encima de los reinos */}
          <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-[#04060A] via-[#04060A]/80 to-transparent z-10 pointer-events-none"></div>
        </>
      )}
    </div>
  );
}
