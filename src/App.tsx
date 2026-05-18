/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShoppingCart, MessageCircle, ArrowRight, Minus, Plus, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import devbankImage from './image/devbank.jpeg';
import bochonokImage from './image/bochonok.jpeg';
import dyagil05Img from './image/dyagil_05.jpg';
import lesnoyImg from './image/lesnoy.jpg';

export default function App() {
  const [selectedVariety, setSelectedVariety] = useState<string | null>(null);
  const [cart, setCart] = useState<{ name: string; weight: string; price: number; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const getOrderMessage = () => {
    let msg = `Здравствуйте!`;
    if (formData.name) msg += ` Меня зовут ${formData.name}.`;
    if (formData.phone) msg += ` Мой номер: ${formData.phone}.`;
    
    if (cart.length > 0) {
      msg += `\n\nЗаказ:\n`;
      cart.forEach(item => {
        msg += `• ${item.name} (${item.weight}) x ${item.quantity}: ${item.price * item.quantity}₽\n`;
      });
      msg += `\nИтого: ${cartTotal}₽`;
    }
    
    return msg;
  };

  const handleCopyAndOpen = (url: string, platform: string) => {
    const text = getOrderMessage();
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(platform);
      // Задержка 2.5 секунды перед открытием ссылки
      setTimeout(() => {
        setCopyStatus(null);
        window.open(url, '_blank');
      }, 2500);
    });
  };

  const varieties = [
    { name: 'Эспарцетовый', tag: 'Светлый · Кремовый', badge: '#FFF8E1', price: '580₽', desc: 'Обладает нежным, едва уловимым ароматом и мягким вкусом. При кристаллизации превращается в белоснежное масло — идеальный десерт для детей и гурманов.' },
    { name: 'Васильковый', tag: 'Нежный · Цветочный', badge: '#E3F2FD', price: '500₽', desc: 'Редкий сорт с тонким ароматом полевых васильков. Вкус мягкий, с легким оттенком миндаля в послевкусии.' },
    { name: 'Донниковый', tag: 'Ванильный · Целебный', badge: '#FFF9C4', price: '680₽', desc: 'Светло-янтарный мёд с отчетливым ароматом ванили. Один из самых полезных сортов для укрепления иммунитета.' },
    { name: 'Дягилевый', tag: 'Тёмный · Премиум', badge: '#D4922A', price: '850₽', desc: 'Один из самых ценных сортов. Аромат карамельный; вкус насыщенный, почти ирисовый. Настоящее лакомство знатока.' },
    { name: 'Горный', tag: 'Золотистый · Сложный', badge: '#C8860A', price: '530₽', desc: 'Пчёлы работают на высотных альпийских лугах Алтая. Вкус многогранный: сладость уступает место пряным нотам.' },
    { name: 'Высокогорный', tag: 'Редкий · Чистый', badge: '#E8B84B', price: '680₽', desc: 'Собирается на высоте более 1200 метров. Экологически безупречный, с концентрированным ароматом диких трав.' },
    { name: 'Таёжный', tag: 'Тёмный · Ароматный', badge: '#F7D87A', price: '410₽', desc: 'Собирается в глухой сибирской тайге. Аромат смолистый, густой; во вкусе чувствуется дикость и сила нетронутого леса.' },
    { name: 'Гречишный', tag: 'Тёмный · Терпкий', badge: '#8B5A00', price: '380₽', desc: 'Тёмно-янтарный, почти шоколадный. Вкус резкий, с характерной горчинкой и долгим послевкусием.' },
    { name: 'Лесной', tag: 'Янтарный · Лесной', badge: '#E8B84B', price: '400₽', desc: 'Лесные цветы, ивовый цвет, малина, дикий клевер. Вкус деликатный и одновременно глубокий.' },
    { name: 'Цветочный', tag: 'Полифлорный · Традиционный', badge: '#FFD54F', price: '400₽', desc: 'Классический вкус разнообразия летних цветов. Сбалансированный аромат и приятная сладость.' },
    { name: 'Подсолнечный', tag: 'Яркий · Солнечный', badge: '#FBC02D', price: '380₽', desc: 'Ярко-желтый мёд с легким терпким вкусом. Богат каротином и витамином А, быстро кристаллизуется в нежные кристаллы.' },
    { name: 'Разнотравье светлое', tag: 'Луговое · Легкое', badge: '#FFFDE7', price: '380₽', desc: 'Мёд с луговых цветов. Легкий, ароматный, с преобладанием нот клевера и люцерны.' },
    { name: 'Разнотравье тёмное', tag: 'Насыщенное · Травяное', badge: '#F9A825', price: '380₽', desc: 'Собран в период цветения медоносов второй половины лета. Вкус более глубокий, с пряными оттенками.' },
  ];

  const addToCart = (name: string, weight: string, priceStr: string) => {
    const price = parseInt(priceStr.replace(/[^0-9]/g, ''));
    setCart(prev => {
      const existing = prev.find(item => item.name === name && item.weight === weight);
      if (existing) {
        return prev.map(item => 
          (item.name === name && item.weight === weight) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { name, weight, price, quantity: 1 }];
    });
  };

  const removeFromCart = (name: string, weight: string) => {
    setCart(prev => prev.filter(item => !(item.name === name && item.weight === weight)));
  };

  const updateQuantity = (name: string, weight: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.name === name && item.weight === weight) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleVarietyClick = (name: string) => {
    setSelectedVariety(name);
    const element = document.getElementById('prices');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-cream selection:bg-honey/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex justify-between items-center bg-black/80 backdrop-blur-md border-b border-gold/20">
        <a href="#" className="font-sans text-[13px] font-bold tracking-[0.25em] text-gold uppercase no-underline">
          Алтайский Мёд
        </a>
        <ul className="hidden md:flex gap-8 list-none">
          <li><a href="#varieties" className="text-white/75 hover:text-gold-light transition-colors text-base tracking-widest no-underline">Сорта</a></li>
          <li><a href="#barrels" className="text-white/75 hover:text-gold-light transition-colors text-base tracking-widest no-underline">Бочонки</a></li>
          <li><a href="#prices" className="text-white/75 hover:text-gold-light transition-colors text-base tracking-widest no-underline">Цены</a></li>
          <li><a href="#contact" className="text-white/75 hover:text-gold-light transition-colors text-base tracking-widest no-underline">Контакты</a></li>
        </ul>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 text-white/75 hover:text-gold transition-colors relative"
          >
            <ShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-dark text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </button>
          <a href="#checkout" className="hidden sm:block font-sans text-[11px] font-normal tracking-[0.15em] text-dark bg-gold px-5 py-2.5 rounded-[2px] no-underline hover:bg-gold-light transition-all">
            Заказать
          </a>
        </div>
      </nav>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-cream z-[70] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="font-sans text-[13px] font-bold tracking-[0.25em] text-bark uppercase">Корзина</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-bark/40 hover:text-bark transition-colors">
                  <X size={24} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <ShoppingCart size={48} className="text-bark/10 mb-4" />
                  <p className="text-bark-mid font-light">Ваша корзина пуста</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 btn-primary"
                  >
                    Вернуться к покупкам
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-6 pr-4">
                    {cart.map((item, idx) => (
                      <div key={`${item.name}-${item.weight}-${idx}`} className="flex justify-between items-center py-4 border-b border-bark/10 group">
                        <div className="flex-1">
                          <h4 className="font-semibold text-bark mb-1">{item.name}</h4>
                          <p className="text-[10px] text-bark/40 uppercase tracking-widest">{item.weight}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <button 
                              onClick={() => updateQuantity(item.name, item.weight, -1)}
                              className="w-6 h-6 rounded-full border border-bark/20 flex items-center justify-center text-bark hover:bg-gold hover:border-gold transition-all"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-sans font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.name, item.weight, 1)}
                              className="w-6 h-6 rounded-full border border-bark/20 flex items-center justify-center text-bark hover:bg-gold hover:border-gold transition-all"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-sans font-bold text-honey mb-2">{item.price * item.quantity} ₽</p>
                          <button 
                            onClick={() => removeFromCart(item.name, item.weight)}
                            className="text-[10px] text-red-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-bark/10 mt-6">
                    <div className="flex justify-between items-end mb-8">
                      <div>
                        <p className="text-[10px] text-bark/40 uppercase tracking-[0.2em] mb-1">Итоговая сумма</p>
                        <p className="text-3xl font-sans font-bold text-bark">{cartTotal} ₽</p>
                      </div>
                      <p className="text-[10px] text-bark-mid italic italic">Без учета доставки</p>
                    </div>
                    <button 
                      onClick={() => {
                        setIsCartOpen(false);
                        const checkout = document.getElementById('checkout');
                        if (checkout) {
                          checkout.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="w-full btn-primary text-center py-5"
                    >
                      Оформить заказ
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-bark bg-hero-texture grid grid-cols-1 lg:grid-cols-2 items-center px-6 md:px-20 overflow-hidden pt-20">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-b from-transparent to-cream z-10 pointer-events-none"></div>
        
        <div className="z-20 py-12">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-sans text-[11px] font-light tracking-[0.4em] text-gold uppercase mb-6"
          >
            Алтайский мёд · Натуральный · С пасеки
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[clamp(52px,7vw,96px)] font-light leading-[0.95] text-white tracking-tight mb-8"
          >
            Вкус <br />
            <span className="italic text-gold-light">с характером</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-white/65 text-xl leading-relaxed max-w-md mb-10 font-light"
          >
            Живой алтайский мёд прямо с пасеки — 13 сортов от луговых до высокогорных. Настоящий, как тайга.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <a href="#varieties" className="btn-primary">Выбрать сорт</a>
            <a href="#prices" className="btn-ghost">Смотреть цены →</a>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.2 }}
          className="relative hidden lg:flex justify-center items-center h-full pt-12"
        >
          <div className="relative w-[500px] h-[500px] flex items-center justify-center">
            {/* Ambient Background Glow */}
            <div className="absolute inset-[-60px] bg-radial-[circle] from-honey/30 to-transparent blur-3xl animate-pulse-custom"></div>
            
            {/* Aesthetic Borders */}
            <div className="absolute inset-0 rounded-full border border-gold/20 animate-spin-custom">
               <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_#E8B84B]"></div>
            </div>

            {/* The Main Photo Requested */}
            <div className="relative z-10 w-[420px] h-[420px] rounded-full overflow-hidden border-4 border-gold/10 shadow-[0_30px_70px_rgba(0,0,0,0.6)]">
              <img 
                src={devbankImage} 
                alt="Натуральный алтайский мёд"
                className="w-full h-full object-cover scale-110 hover:scale-125 transition-transform duration-[3s] ease-out"
              />
              <div className="absolute inset-0 bg-linear-to-t from-bark/40 to-transparent"></div>
            </div>

            {/* Featured Item Float */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 z-30 bg-white p-4 rounded-xl shadow-2xl border border-gold/20 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center text-dark font-bold">100%</div>
                <div>
                  <p className="text-xs font-bold text-bark uppercase tracking-tighter">Натурально</p>
                  <p className="text-[10px] text-bark-mid italic">Без добавок</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Varieties Grid */}
      <section id="varieties" className="py-24 px-6 md:px-20 bg-white-warm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-sans text-[12px] font-light tracking-[0.5em] text-amber uppercase mb-4">Коллекция</p>
            <h2 className="text-5xl md:text-7xl font-light leading-tight mb-4 tracking-tight">
              13 сортов — <span className="italic text-honey-dark">каждый неповторим</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-bark/10 p-0.5 border border-bark/10">
            {varieties.map((v, i) => (
              <motion.div 
                key={v.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleVarietyClick(v.name)}
                className={`group p-10 relative overflow-hidden cursor-pointer transition-all duration-500 ${selectedVariety === v.name ? 'bg-dark' : 'bg-cream hover:bg-dark'}`}
              >
                <div className="w-2.5 h-2.5 rounded-full mb-4 group-hover:bg-honey transition-colors" style={{ backgroundColor: v.badge }}></div>
                <h3 className={`font-sans text-[15px] font-normal tracking-[0.2em] uppercase mb-2 transition-colors ${selectedVariety === v.name ? 'text-cream' : 'text-bark group-hover:text-cream'}`}>{v.name}</h3>
                <span className={`inline-block text-sm tracking-wider bg-honey/10 px-2.5 py-1 rounded-full mb-4 transition-all ${selectedVariety === v.name ? 'bg-gold/20 text-gold' : 'text-honey-dark group-hover:bg-gold/20 group-hover:text-gold'}`}>{v.tag}</span>
                <hr className={`border-none border-t my-4 transition-colors ${selectedVariety === v.name ? 'border-gold/30' : 'border-bark/10 group-hover:border-gold/30'}`} />
                <p className={`text-lg leading-relaxed mb-6 transition-colors ${selectedVariety === v.name ? 'text-cream/80' : 'text-bark-mid group-hover:text-cream/80'}`}>{v.desc}</p>
                <div className={`font-sans text-[15px] transition-colors ${selectedVariety === v.name ? 'text-cream' : 'text-bark group-hover:text-cream'}`}>
                  от <span className={`font-bold transition-colors ${selectedVariety === v.name ? 'text-gold-light' : 'text-honey group-hover:text-gold-light'}`}>{v.price}</span> / 500 г
                </div>
                <div className={`absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity ${selectedVariety === v.name ? 'opacity-100' : ''}`}>
                  <ArrowRight size={18} className="text-gold" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wooden Barrels Section */}
      <section id="barrels" className="py-24 px-6 md:px-20 bg-dark relative overflow-hidden">
        <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 font-sans text-[25vw] font-bold text-white/[0.02] leading-none select-none pointer-events-none">МЁД</div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <p className="font-sans text-[10px] font-light tracking-[0.5em] text-gold uppercase mb-6">Особая линейка</p>
          <h2 className="text-4xl md:text-6xl font-light text-white leading-tight mb-12">
            Мёд в деревянных <span className="italic text-gold-light">бочонках</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-white/65 text-xl leading-relaxed mb-10 font-light max-w-lg">
                Четыре лучших сорта в авторских деревянных бочонках ручной работы. Натуральное дерево с фирменной биркой — идеально для подарка.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Гречишный', 'Таёжный', 'Лесной', 'Горный'].map(item => (
                  <div key={item} className="border border-gold/20 p-7 hover:border-gold/60 hover:bg-gold/5 transition-all group flex flex-col">
                    <h4 className="font-sans text-[12px] tracking-[0.15em] text-white uppercase mb-2">{item}</h4>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-5">В деревянном бочонке</p>
                    
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <button 
                        onClick={() => addToCart(`${item} (в бочонке)`, '0.5 кг', '2000₽')}
                        className="flex flex-col items-center justify-center py-3 border border-gold/20 rounded-[2px] hover:bg-gold hover:border-gold transition-all group/btn cursor-pointer bg-white/5"
                      >
                         <span className="text-[14px] text-white group-hover/btn:text-dark font-bold uppercase tracking-tighter mb-1">0.5 кг</span>
                         <span className="text-xs font-sans font-bold text-gold group-hover/btn:text-dark">2 000 ₽</span>
                      </button>
                      <button 
                        onClick={() => addToCart(`${item} (в бочонке)`, '1 кг', '2500₽')}
                        className="flex flex-col items-center justify-center py-3 border border-gold/20 rounded-[2px] hover:bg-gold hover:border-gold transition-all group/btn cursor-pointer bg-white/5"
                      >
                         <span className="text-[14px] text-white group-hover/btn:text-dark font-bold uppercase tracking-tighter mb-1">1 кг</span>
                         <span className="text-xs font-sans font-bold text-gold group-hover/btn:text-dark">2 500 ₽</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative max-w-md w-full">
                <div className="absolute inset-0 bg-radial-[circle] from-gold/20 to-transparent blur-3xl"></div>
                <img 
                  src={bochonokImage} 
                  alt="Деревянный бочонок с медом"
                  className="w-full h-auto object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.7)] relative z-10 transform scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Header Placeholder */}
      <section id="prices" className="py-24 px-6 md:px-20 bg-cream-dark">
         <div className="max-w-4xl mx-auto">
            <p className="font-sans text-[10px] font-light tracking-[0.5em] text-honey uppercase mb-4">Прайс-лист</p>
            <h2 className="text-4xl md:text-5xl font-light mb-12 tracking-tight">Честные <span className="italic text-bark">цены</span></h2>
            
            {/* Table Headers with Images */}
            <div className="flex border-b border-bark/20 pb-4 sm:pb-6 mb-2 px-4 -mx-4 items-end">
              <div className="flex-1 pr-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-bark/40">Сорт мёда</span>
              </div>
              <div className="flex items-center gap-3 sm:gap-12 flex-shrink-0">
                <div className="flex flex-col items-center w-20 sm:w-24 group/jar">
                  <div className="relative overflow-visible">
                    <motion.img 
                      whileHover={{ scale: 2.5, zIndex: 50, y: -10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      src={dyagil05Img} 
                      alt="Стекло 500г" 
                      className="h-12 sm:h-16 w-auto mb-3 object-contain drop-shadow-md cursor-zoom-in relative z-20" 
                    />
                  </div>
                  <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-bark">Стекло</span>
                  <span className="text-[11px] font-mono uppercase tracking-tighter text-bark-mid">500 гр</span>
                </div>
                <div className="flex flex-col items-center w-20 sm:w-24 group/jar">
                  <div className="relative overflow-visible">
                    <motion.img 
                      whileHover={{ scale: 2.5, zIndex: 50, y: -10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      src={bochonokImage} 
                      alt="ПЭТ 1кг" 
                      className="h-12 sm:h-16 w-auto mb-3 object-contain drop-shadow-md cursor-zoom-in relative z-20" 
                    />
                  </div>
                  <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-bark">ПЭТ банка</span>
                  <span className="text-[11px] font-mono uppercase tracking-tighter text-bark-mid">1 кг</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
                {[
                  { name: 'Эспарцетовый', p500: '580₽', p1: '1 000₽' },
                  { name: 'Васильковый', p500: '500₽', p1: '860₽' },
                  { name: 'Донниковый', p500: '680₽', p1: '1 220₽' },
                  { name: 'Дягилевый', p500: '850₽', p1: '1 560₽' },
                  { name: 'Подсолнечный', p500: '380₽', p1: '610₽' },
                  { name: 'Гречишный', p500: '380₽', p1: '610₽' },
                  { name: 'Цветочный', p500: '400₽', p1: '650₽' },
                  { name: 'Лесной', p500: '400₽', p1: '650₽' },
                  { name: 'Таёжный', p500: '410₽', p1: '690₽' },
                  { name: 'Горный', p500: '530₽', p1: '920₽' },
                  { name: 'Высокогорный', p500: '680₽', p1: '1 220₽' },
                  { name: 'Разнотравье светлое', p500: '380₽', p1: '610₽' },
                  { name: 'Разнотравье тёмное', p500: '380₽', p1: '610₽' },
                ].map((item, idx) => (
                 <div 
                   key={idx} 
                   className={`flex flex-row items-center justify-between py-4 sm:py-6 border-b border-bark/10 group transition-all px-4 -mx-4 rounded-lg ${selectedVariety === item.name ? 'bg-gold/10 border-gold/30 ring-1 ring-gold/20' : 'hover:bg-bark/5'}`}
                 >
                    <div className="flex flex-col gap-1 flex-1 min-w-0 pr-2">
                      <span className="text-base sm:text-xl font-semibold tracking-wide group-hover:text-honey-dark transition-colors flex items-center flex-wrap gap-2">
                        {item.name}
                        {selectedVariety === item.name && (
                          <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-gold text-dark text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter"
                          >
                            Ваш выбор
                          </motion.span>
                        )}
                      </span>
                      {selectedVariety === item.name && (
                        <p className="text-[10px] sm:text-xs text-bark/50 italic">Свежий сбор этого сезона</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 sm:gap-12 flex-shrink-0">
                       <button 
                         onClick={() => addToCart(item.name, '500г', item.p500)}
                         className="text-center group/price cursor-pointer hover:bg-gold/20 p-2 rounded transition-all w-20 sm:w-24"
                       >
                          <p className="text-base sm:text-lg font-sans font-bold text-bark group-hover/price:text-honey transition-colors">{item.p500}</p>
                          <div className="hidden sm:block text-[9px] font-bold text-gold opacity-0 group-hover/price:opacity-100 transition-opacity">КУПИТЬ</div>
                       </button>
                       <button 
                         onClick={() => addToCart(item.name, '1кг', item.p1)}
                         className="text-center group/price cursor-pointer hover:bg-gold/20 p-2 rounded transition-all w-20 sm:w-24"
                       >
                          <p className="text-base sm:text-lg font-sans font-bold text-honey group-hover/price:text-honey-dark transition-colors">{item.p1}</p>
                          <div className="hidden sm:block text-[9px] font-bold text-gold opacity-0 group-hover/price:opacity-100 transition-opacity">КУПИТЬ</div>
                       </button>
                    </div>
                 </div>
               ))}
            </div>
            <p className="mt-12 text-lg text-bark italic">✦ Весь мёд можно попробовать перед покупкой</p>
         </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 md:px-20 bg-bark relative">
        <div className="absolute inset-0 bg-radial-[at_80%_50%] from-honey/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div>
            <p className="font-sans text-[10px] font-light tracking-[0.5em] text-gold uppercase mb-6">Связаться с нами</p>
            <h2 className="text-4xl md:text-6xl font-light text-white leading-tight mb-8">
              Приходите <span className="italic text-gold-light">попробовать</span>
            </h2>
            <p className="text-white/60 text-xl leading-relaxed font-light mb-10 max-w-md">
              Весь мёд можно попробовать на месте. Мы рады ответить на вопросы и подобрать ваш идеальный сорт.
            </p>
            
            <div className="space-y-6">
              <div className="p-8 border border-gold/20 hover:border-gold/50 hover:bg-gold/5 transition-all">
                <p className="font-sans text-[9px] tracking-[0.4em] text-gold uppercase mb-3 text-white/50">Телефон / WhatsApp</p>
                <div className="flex flex-col gap-1">
                   <a href="tel:+79132328395" className="text-2xl text-white font-light hover:text-gold-light transition-colors no-underline tracking-wide">+7 913 232 83 95</a>
                   <a href="tel:+79220201962" className="text-2xl text-white font-light hover:text-gold-light transition-colors no-underline tracking-wide">+7 922 020 19 62</a>
                </div>
              </div>
              
              <div className="p-8 border border-gold/20 hover:border-gold/50 hover:bg-gold/5 transition-all">
                <p className="font-sans text-[9px] tracking-[0.4em] text-gold uppercase mb-3 text-white/50">Адрес</p>
                <p className="text-2xl text-white font-light tracking-wide">Шейнкмана, 7 / оф. 107</p>
              </div>
            </div>
          </div>

          <div id="checkout" className="bg-white/5 p-8 md:p-12 border border-gold/10 relative overflow-hidden group rounded-[2px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl -z-10 group-hover:bg-gold/10 transition-colors"></div>
            
            <h3 className="font-sans text-[13px] font-bold tracking-[0.25em] text-white uppercase mb-8">Оформить заказ</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[12px] text-white uppercase tracking-widest mb-2 px-1 font-bold">Ваше имя</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Иван"
                  className="w-full bg-white/5 border border-white/10 rounded-[2px] px-5 py-4 text-white focus:outline-none focus:border-gold/50 transition-colors placeholder:text-white/10"
                />
              </div>
              <div>
                <label className="block text-[12px] text-white uppercase tracking-widest mb-2 px-1 font-bold">Телефон</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+7 (___) ___-__-__"
                  className="w-full bg-white/5 border border-white/10 rounded-[2px] px-5 py-4 text-white focus:outline-none focus:border-gold/50 transition-colors placeholder:text-white/10"
                />
              </div>

              {cart.length > 0 && (
                <div className="pt-6 pb-2 border-y border-white/5 my-6">
                  <h4 className="text-[10px] text-gold font-bold uppercase tracking-[0.2em] mb-4 px-1">Ваш заказ:</h4>
                  <div className="space-y-3 px-1 max-h-48 overflow-y-auto custom-scrollbar">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs group/item">
                        <div className="flex flex-col">
                          <span className="text-white/80 font-medium">{item.name}</span>
                          <span className="text-[10px] text-white/30 uppercase tracking-tighter">{item.weight} × {item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gold font-sans">{item.price * item.quantity} ₽</span>
                          <button 
                            onClick={() => removeFromCart(item.name, item.weight)}
                            className="text-white/20 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-end px-1">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">Итого:</span>
                    <span className="text-xl font-sans font-bold text-white">{cartTotal} ₽</span>
                  </div>
                </div>
              )}
              
              <div className="pt-4 space-y-4">
                <div className="px-1 flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[14px] text-white font-bold uppercase tracking-widest">Выберите мессенджер:</p>
                    <p className="text-[12px] text-white uppercase tracking-wider leading-relaxed">
                      Текст заказа копируется автоматически.<br/>
                      В чате нажмите <span className="text-gold font-bold">«Вставить»</span>
                    </p>
                  </div>
                  <AnimatePresence>
                    {copyStatus && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-gold/20 border border-gold/30 px-2 py-1 rounded-[2px]"
                      >
                        <span className="text-[9px] text-gold font-bold uppercase tracking-[0.1em]">✓ Скопировано</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button 
                    onClick={() => handleCopyAndOpen(`https://wa.me/79220201962?text=${encodeURIComponent(getOrderMessage())}`, 'wa')}
                    className="flex flex-col items-center justify-center gap-2 bg-green-500/10 border border-green-500/30 text-white/80 py-6 px-2 rounded-[2px] hover:bg-green-500 hover:text-white hover:border-green-500 transition-all group/wa cursor-pointer"
                  >
                    <MessageCircle size={20} className="text-green-500 group-hover/wa:text-white transition-colors" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">WhatsApp</span>
                  </button>
                  <button 
                    onClick={() => handleCopyAndOpen(`https://t.me/trvlas`, 'tg')}
                    className="flex flex-col items-center justify-center gap-2 bg-sky-500/10 border border-sky-500/30 text-white/80 py-6 px-2 rounded-[2px] hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all group/tg cursor-pointer"
                  >
                    <Send size={20} className="text-sky-500 group-hover/tg:text-white transition-colors" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">Telegram</span>
                  </button>
                  <button 
                    onClick={() => handleCopyAndOpen(`https://vk.me/club230030571`, 'vk')}
                    className="flex flex-col items-center justify-center gap-2 bg-blue-600/10 border border-blue-600/30 text-white/80 py-6 px-2 rounded-[2px] hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all group/vk cursor-pointer"
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      className="w-5 h-5 fill-blue-600 group-hover:fill-white transition-colors"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.66 16.59h-1.46c-.55 0-.71-.44-1.7-1.42-.86-.84-1.24-.95-1.46-.95-.3 0-.39.08-.39.49v1.27c0 .41-.13.61-1.21.61-1.78 0-3.76-1.07-5.16-3.04-2.09-2.92-2.67-4.22-2.67-4.59 0-.25.09-.48.55-.48h1.46c.41 0 .56.18.67.48.74 2.18 1.98 4.1 2.49 4.1.19 0 .27-.08.27-.53V9.75c0-.75-.43-.81-.43-1.08 0-.13.1-.26.28-.26h2.3c.34 0 .47.18.47.58v3.13c0 .34.15.46.27.46.19 0 .34-.12.68-.46 1-1.18 1.76-3.05 1.76-3.05.09-.26.27-.48.68-.48h1.46c.44 0 .56.22.46.54-.18.79-1.83 3.12-1.83 3.12-.19.28-.26.39 0 .74.19.26.83.82 1.26 1.34.8 1 1.4 1.79 1.56 2.34.17.5.02.77-.43.77z"/>
                    </svg>
                    <span className="text-[10px] font-bold tracking-widest uppercase">Vkontakte</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark py-12 px-6 md:px-20 border-t border-gold/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="font-sans text-[12px] font-bold tracking-[0.25em] text-gold uppercase">Алтайский Мёд</span>
          <p className="text-[14px] text-white/30 tracking-widest text-center">Натуральный мёд с Алтая · Шейнкмана, 7 / оф. 107</p>
          <p className="text-[14px] text-white/20">© 2025 — Все права защищены</p>
        </div>
      </footer>
    </div>
  );
}
