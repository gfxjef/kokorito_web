'use client';
import { menuItems } from '@/data/staticData';

export default function Sidebar() {
  return (
    <aside className="w-80 bg-primary text-white h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6 text-center">Menú Vertical</h2>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="flex items-center px-4 py-3 text-white hover:bg-accent hover:bg-opacity-20 rounded-lg transition-colors duration-200 group"
            >
              <div className="w-2 h-2 bg-white rounded-full mr-3 group-hover:bg-accent"></div>
              <span className="font-medium">{item.name}</span>
            </a>
          ))}
        </nav>
        
        {/* Decorative elements */}
        <div className="mt-8 pt-8 border-t border-white border-opacity-20">
          <div className="text-center text-sm opacity-75">
            <p>¡Descubre nuestros</p>
            <p className="font-semibold">sabores únicos!</p>
          </div>
        </div>
      </div>
    </aside>
  );
} 