export interface Version {
  source: string;
  text: string;
}

export interface Character {
  id: string;
  name: string;
  greekName: string;
  category: CharacterCategory;
  gender: 'male' | 'female' | 'unknown';
  title: string;
  description: string;
  versions: Version[];
  parents: string[];
  partners: string[];
  children: string[];
  trees: TreeId[];
}

export type CharacterCategory =
  | 'primordial'
  | 'titan'
  | 'olimpico'
  | 'heroe'
  | 'mortal'
  | 'ninfa'
  | 'monstruo';

export interface CategoryInfo {
  id: CharacterCategory;
  name: string;
  color: string;
}

export type TreeId = 'titanes' | 'olimpicos' | 'heroes' | 'sisifo';

/** Unión entre dos personajes (o un solo progenitor) que produce descendencia */
export interface TreeUnion {
  /** ID de la pareja (omitir para partenogénesis / nacimiento solo) */
  partnerId?: string;
  /** Hijos de esta unión */
  children: TreeNode[];
  /** Marca esta unión como "creación" en vez de descendencia biológica */
  isCreation?: boolean;
}

export interface TreeNode {
  id: string;
  name?: string;
  category?: CharacterCategory;
  /** Uniones reproductivas de este personaje */
  unions?: TreeUnion[];
  /** Nodo de grupo (Musas, Cíclopes…) */
  isGroup?: boolean;
  groupName?: string;
  groupImage?: string;
  /** IDs de los miembros del grupo */
  members?: string[];
  memberNodes?: TreeNode[];
}

export interface TreeData {
  id: TreeId;
  name: string;
  description: string;
  root: TreeNode;
  nodeMeta?: Record<string, { name?: string; category?: CharacterCategory }>;
}

export interface TreeListItem {
  id: TreeId;
  name: string;
  description: string;
  icon: string;
}

/* ─── Graph model (nodes/edges) ───────────────────────────────────── */

export type GraphNodeType = 'individuo' | 'grupo' | 'union';
export type GraphEdgeType = 'partner' | 'child' | 'membership' | 'creation';

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  name?: string;
  label?: string;
  category?: CharacterCategory;
  gender?: 'male' | 'female' | 'unknown';
  groupImage?: string;
  /** For union nodes: which person node should own/claim this union */
  claimedBy?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: GraphEdgeType;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** IDs of root nodes for multi-root trees (order determines build/visual order) */
  roots?: string[];
}

export type GlossaryCategory = 'concepto' | 'autor' | 'lugar' | 'tribu' | 'criatura' | 'objeto';

export interface GlossaryTerm {
  id: string;
  title: string;
  description: string;
  category: GlossaryCategory;
}

export type TimelineCategory = 'origen' | 'titanomaquia' | 'dioses' | 'heroes' | 'troya';

export interface TimelineEvent {
  id: string;
  period: string; 
  title: string;
  description: string;
  category: TimelineCategory;
  level: number;
}
