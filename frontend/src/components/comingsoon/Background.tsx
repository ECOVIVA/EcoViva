import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: Particle[] = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 10), 150);
    const connectionDistance = 100;
    const maxConnections = 3;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      connections: number;

      constructor() {
        //@ts-ignore
        this.x = Math.random() * canvas.width;
        //@ts-ignore
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = `rgba(${Math.floor(100 + Math.random() * 50)}, ${Math.floor(200 + Math.random() * 55)}, ${Math.floor(100 + Math.random() * 50)}, ${0.2 + Math.random() * 0.3})`;
        this.connections = 0;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
//@ts-ignore
        if (this.x > canvas.width) this.x = 0;
        //@ts-ignore
        else if (this.x < 0) this.x = canvas.width;
        //@ts-ignore
        if (this.y > canvas.height) this.y = 0;
        //@ts-ignore
        else if (this.y < 0) this.y = canvas.height;

        this.connections = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          if (particles[i].connections >= maxConnections || particles[j].connections >= maxConnections) continue;
          
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            particles[i].connections++;
            particles[j].connections++;
            
            if (!ctx) continue;
            const opacity = 1 - distance / connectionDistance;
            ctx.strokeStyle = `rgba(120, 255, 150, ${opacity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create subtle gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(5, 30, 15, 0.8)');
      gradient.addColorStop(0.5, 'rgba(10, 40, 20, 0.8)');
      gradient.addColorStop(1, 'rgba(15, 50, 25, 0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      connectParticles();
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    }

    createParticles();
    animate();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default Background;