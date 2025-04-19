import React, { useEffect, useRef } from 'react';

const DigitalLeaves: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let leaves: DigitalLeaf[] = [];
    const leafCount = Math.min(Math.floor(window.innerWidth / 20), 50);

    class DigitalLeaf {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      type: number;

      constructor() {
         //@ts-ignore
        this.x = Math.random() * canvas.width;
         //@ts-ignore
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 30 + 15;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 0.8 - 0.4;
        
        
        const green = Math.floor(150 + Math.random() * 105);
        this.color = `rgba(${Math.floor(80 + Math.random() * 40)}, ${green}, ${Math.floor(80 + Math.random() * 40)}, ${0.2 + Math.random() * 0.3})`;
        
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() * 0.02) - 0.01;
        this.type = Math.floor(Math.random() * 3); // Different leaf shapes
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        //@ts-ignore
        if (this.x > canvas.width + this.size) this.x = -this.size;
        //@ts-ignore
        else if (this.x < -this.size) this.x = canvas.width + this.size;
        //@ts-ignore
        if (this.y > canvas.height + this.size) this.y = -this.size;
        //@ts-ignore
        else if (this.y < -this.size) this.y = canvas.height + this.size;
      }

      draw() {
        if (!ctx) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.fillStyle = this.color;
        ctx.strokeStyle = `rgba(180, 255, 200, 0.4)`;
        ctx.lineWidth = 0.5;
        
        // Draw different digital leaf styles
        if (this.type === 0) {
          // Digital leaf style 1 - Circuit-like leaf
          ctx.beginPath();
          ctx.moveTo(0, -this.size/2);
          ctx.bezierCurveTo(this.size/3, -this.size/2, this.size/2, -this.size/4, this.size/2, 0);
          ctx.bezierCurveTo(this.size/2, this.size/4, this.size/3, this.size/2, 0, this.size/2);
          ctx.bezierCurveTo(-this.size/3, this.size/2, -this.size/2, this.size/4, -this.size/2, 0);
          ctx.bezierCurveTo(-this.size/2, -this.size/4, -this.size/3, -this.size/2, 0, -this.size/2);
          ctx.fill();
          ctx.stroke();
          
          // Add digital lines
          ctx.beginPath();
          ctx.moveTo(0, -this.size/2);
          ctx.lineTo(0, this.size/2);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(-this.size/2, 0);
          ctx.lineTo(this.size/2, 0);
          ctx.stroke();
          
        } else if (this.type === 1) {
          // Digital leaf style 2 - Pixelated leaf
          const pixelSize = this.size / 8;
          
          for (let i = -3; i <= 3; i++) {
            for (let j = -3; j <= 3; j++) {
              if ((i*i + j*j) < 10) {
                ctx.fillRect(i*pixelSize, j*pixelSize, pixelSize, pixelSize);
              }
            }
          }
          
        } else {
          // Digital leaf style 3 - Fractal-like leaf
          drawBranch(ctx, 0, 0, this.size/2, 0, 3);
        }
        
        ctx.restore();
      }
    }
    
    function drawBranch(ctx: CanvasRenderingContext2D, startX: number, startY: number, length: number, angle: number, depth: number) {
      if (depth <= 0) return;
      
      const endX = startX + Math.cos(angle) * length;
      const endY = startY + Math.sin(angle) * length;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Draw smaller branches
      drawBranch(ctx, endX, endY, length * 0.6, angle + 0.5, depth - 1);
      drawBranch(ctx, endX, endY, length * 0.6, angle - 0.5, depth - 1);
    }

    function createLeaves() {
      leaves = [];
      for (let i = 0; i < leafCount; i++) {
        leaves.push(new DigitalLeaf());
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      leaves.forEach(leaf => {
        leaf.update();
        leaf.draw();
      });

      requestAnimationFrame(animate);
    }

    createLeaves();
    animate();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createLeaves();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-1" />;
};

export default DigitalLeaves;