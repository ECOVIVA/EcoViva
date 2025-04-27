import React, { useEffect, useRef } from 'react';

const Stars: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let stars: Star[] = [];
    const starCount = Math.min(Math.floor(window.innerWidth / 4), 200);

    class Star {
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;
      blur: number;

      constructor() {
        //@ts-ignore
        this.x = Math.random() * canvas.width;
        //@ts-ignore
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.opacity = 0;
        this.blur = Math.random() * 2;
      }

      update() {
        this.y -= this.speedY;
        
       
         //@ts-ignore
        if (this.y > canvas.height / 2) {
           //@ts-ignore
          this.opacity = 1 - ((this.y - canvas.height / 2) / (canvas.height / 2));
        } else {
          //@ts-ignore
          this.opacity = this.y / (canvas.height / 2);
        }

        if (this.y < 0) {
           //@ts-ignore
          this.y = canvas.height + Math.random() * 100;
           //@ts-ignore
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        if (!ctx) return;
        
        ctx.shadowBlur = this.blur;
        ctx.shadowColor = "rgba(180, 255, 200, 0.7)";
        ctx.fillStyle = `rgba(180, 255, 200, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function createStars() {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        star.update();
        star.draw();
      });

      requestAnimationFrame(animate);
    }

    createStars();
    animate();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createStars();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-5" />;
};

export default Stars;