import { useParams, useNavigate } from 'react-router-dom';
import { treeList, getTree } from '../data';
import TreeView from '../components/tree/TreeView';
import './TreesPage.css';

export default function TreesPage() {
  const { treeId } = useParams<{ treeId: string }>();
  const navigate = useNavigate();

  const activeTreeId = treeId ?? 'titanes';
  const activeTree = getTree(activeTreeId as 'titanes' | 'olimpicos' | 'heroes' | 'sisifo');

  return (
    <main className="trees-page">
      <div className="container">
        <h1 className="trees-page__title fade-in-up">Árboles Genealógicos</h1>

        <nav className="trees-page__tabs fade-in-up" style={{ animationDelay: '0.1s' }} aria-label="Seleccionar árbol">
          {treeList.map(t => (
            <button
              key={t.id}
              className={`trees-page__tab ${t.id === activeTreeId ? 'trees-page__tab--active' : ''}`}
              onClick={() => navigate(`/arboles/${t.id}`)}
              aria-current={t.id === activeTreeId ? 'page' : undefined}
            >
              <span className="trees-page__tab-icon">{t.icon}</span>
              <span className="trees-page__tab-name">{t.name}</span>
            </button>
          ))}
        </nav>

        {activeTree && (
          <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="trees-page__description">{activeTree.description}</p>
            <TreeView tree={activeTree} key={activeTreeId} />
          </div>
        )}
      </div>
    </main>
  );
}
