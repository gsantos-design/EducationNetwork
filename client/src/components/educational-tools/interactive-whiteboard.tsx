import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function InteractiveWhiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState([4]);
  const [tool, setTool] = useState("pen");
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      // Set canvas size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      if (ctx) {
        // Set default stroke style
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth[0];
        ctx.lineCap = "round";
        setContext(ctx);
        
        // Save initial blank state
        const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setHistory([initialState]);
        setHistoryIndex(0);
      }
    }
  }, []);

  // Update context when color or line width changes
  useEffect(() => {
    if (context) {
      context.strokeStyle = color;
      context.lineWidth = lineWidth[0];
    }
  }, [color, lineWidth, context]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && context) {
        // Save current drawing
        const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Resize canvas
        canvasRef.current.width = canvasRef.current.offsetWidth;
        canvasRef.current.height = canvasRef.current.offsetHeight;
        
        // Restore drawing
        context.putImageData(imageData, 0, 0);
        context.strokeStyle = color;
        context.lineWidth = lineWidth[0];
        context.lineCap = "round";
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [context, color, lineWidth]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context) return;
    
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    if (tool === "eraser") {
      context.strokeStyle = "#FFFFFF";
    } else {
      context.strokeStyle = color;
    }
    
    context.beginPath();
    context.moveTo(x, y);
    
    setDrawing(true);
    setPosition({ x, y });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!drawing || !context) return;
    
    let clientX, clientY;
    
    if ('touches' in e) {
      e.preventDefault(); // Prevent scrolling when drawing on touch devices
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    context.lineTo(x, y);
    context.stroke();
    
    setPosition({ x, y });
  };

  const endDrawing = () => {
    if (!drawing || !context || !canvasRef.current) return;
    
    context.closePath();
    setDrawing(false);
    
    // Save to history
    const canvas = canvasRef.current;
    const currentState = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // Remove any future states if we drew after undoing
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(currentState);
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0 && context && canvasRef.current) {
      const newIndex = historyIndex - 1;
      const imageData = history[newIndex];
      context.putImageData(imageData, 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1 && context && canvasRef.current) {
      const newIndex = historyIndex + 1;
      const imageData = history[newIndex];
      context.putImageData(imageData, 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const handleClear = () => {
    if (context && canvasRef.current) {
      const canvas = canvasRef.current;
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Save cleared state to history
      const clearedState = context.getImageData(0, 0, canvas.width, canvas.height);
      const newHistory = [...history, clearedState];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <div className="flex gap-2">
                <Button 
                  variant={tool === "pen" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setTool("pen")}
                >
                  <svg 
                    className="w-4 h-4 mr-1" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M12 19l7-7 3 3-7 7-3-3z" />
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                  </svg>
                  Pen
                </Button>
                <Button 
                  variant={tool === "eraser" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setTool("eraser")}
                >
                  <svg 
                    className="w-4 h-4 mr-1" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <path d="M15.5 2H9.5L15 8M20 2h-4.5L9 8.5l7.5 7.5L22 10.5V6l-2-4z" />
                  </svg>
                  Eraser
                </Button>
                <div className="flex items-center ml-2">
                  <input 
                    type="color" 
                    value={color} 
                    onChange={(e) => setColor(e.target.value)} 
                    className="w-8 h-8 cursor-pointer rounded-md border-0"
                  />
                </div>
              </div>
              
              <div className="flex-1 mx-4 max-w-xs">
                <Slider 
                  value={lineWidth} 
                  onValueChange={setLineWidth} 
                  min={1} 
                  max={20} 
                  step={1} 
                  aria-label="Line thickness"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                >
                  <svg 
                    className="w-4 h-4" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M3 10h10a8 8 0 1 1 0 16H3" />
                    <path d="M3 10l5-5" />
                    <path d="M3 10l5 5" />
                  </svg>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                >
                  <svg 
                    className="w-4 h-4" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M21 10H11a8 8 0 1 0 0 16h10" />
                    <path d="M21 10l-5-5" />
                    <path d="M21 10l-5 5" />
                  </svg>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClear}
                >
                  <svg 
                    className="w-4 h-4 mr-1" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full md:w-64">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-2">Background</h3>
            <RadioGroup defaultValue="blank" className="grid grid-cols-3 gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="blank" id="bg-blank" />
                <Label htmlFor="bg-blank" className="text-xs">Blank</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lined" id="bg-lined" />
                <Label htmlFor="bg-lined" className="text-xs">Lined</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="grid" id="bg-grid" />
                <Label htmlFor="bg-grid" className="text-xs">Grid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dotted" id="bg-dotted" />
                <Label htmlFor="bg-dotted" className="text-xs">Dotted</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="isometric" id="bg-isometric" />
                <Label htmlFor="bg-isometric" className="text-xs">Isometric</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="music" id="bg-music" />
                <Label htmlFor="bg-music" className="text-xs">Music</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
      
      <Card className="flex-1 min-h-[480px] border-2 border-dashed border-neutral-200">
        <CardContent className="p-0 h-full">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseOut={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
            className="w-full h-full bg-white cursor-crosshair"
          />
        </CardContent>
      </Card>
      
      <div className="flex justify-between mt-4">
        <Button variant="outline">
          <svg 
            className="w-4 h-4 mr-1" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Save
        </Button>
        <Button variant="outline">
          <svg 
            className="w-4 h-4 mr-1" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Share
        </Button>
      </div>
    </div>
  );
}