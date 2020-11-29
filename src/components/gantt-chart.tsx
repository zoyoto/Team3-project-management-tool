import * as React from 'react';
import {ganttLayOut} from './ganttChart.js';

function GanttChart() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(null);

  React.useEffect(() => {
    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext('2d');

      if (renderCtx) {
        setContext(renderCtx);
      }
    }

    if (context) ganttLayOut(context)

  }, [context]);
  
  return (
    <div
      style={{
        textAlign: 'center',
      }}>
      <canvas
        id="canvas"
        ref={canvasRef}
        width={900}
        height={500}
      ></canvas>
    </div>
  );
}

export default GanttChart;
