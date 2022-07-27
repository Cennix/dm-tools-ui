import './App.css';
import ReactForceGraph2d from 'react-force-graph-2d';
import {data} from './data';
import { useState } from 'react';

function App() {
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());
  const [highlightedLinks, setHighlightedLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);
  const NODE_R = 8;
  
  const updateHighlight = () => {
    setHighlightedNodes(highlightedNodes);
    setHighlightedLinks(highlightedLinks);
  };

  const handleNodeHover = (node:any) => {
    highlightedNodes.clear();
    highlightedLinks.clear();
    if (node) {
      highlightedNodes.add(node);
    }

    setHoverNode(node || null);
    updateHighlight();
  };

  const handleLinkHover = (link:any) => {
    highlightedNodes.clear();
    highlightedLinks.clear();

    if (link) {
      highlightedLinks.add(link);
      highlightedNodes.add(link.source);
      highlightedNodes.add(link.target);
    }

    updateHighlight();
  };

  return (
    <div className="App">
      <ReactForceGraph2d
      nodeRelSize={NODE_R}
      nodeAutoColorBy="group"
      autoPauseRedraw={false}
      linkWidth={link => highlightedLinks.has(link) ? 5 : 1}
      linkDirectionalArrowColor={link => highlightedLinks.has(link) ? "red": "black"}
      linkDirectionalArrowLength={link => highlightedLinks.has(link) ? 2 : 0}
      linkDirectionalArrowRelPos={1}
      linkCurvature="curvature"
      onNodeHover={handleNodeHover}
      onLinkHover={handleLinkHover}
      onNodeClick={ (node) => {console.log(node)}}
      onNodeDragEnd={(node) => {
        node.fx = node.x;
        node.fy = node.y;
      }}
      graphData={data}
      nodeCanvasObject={(node:any, ctx, globalScale) => {
        const label = node.id;
        const fontSize = 12/globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = highlightedNodes.has(node)? "red": node.color;
        ctx.fillText(label, node.x, node.y);

        node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
      }}
      nodePointerAreaPaint={(node:any, color, ctx) => {
        ctx.fillStyle = color;
        const bckgDimensions = node.__bckgDimensions;
        bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);
      }}
    />
    </div>
  );
}

export default App;
