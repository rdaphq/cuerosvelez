import { useRef } from 'react';
import { useCart } from '../../context/CartContext';

import LogoCafe from '/velez-cafe.png';
import './Navbar.css';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(useGSAP);

const NavCart = () => {
    const { totalItems, totalPrice, toggleCart } = useCart();
    function pesoFormat (amount: number): string {
        return amount.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })
    }

    // SCROLLING
    // useEffect(() => {
    //     const nav = document.getElementById('nav');

    //     function navScroll () {
    //         if (window.scrollY > 200) {
    //             nav?.classList.add('scrolled');
    //         } else {
    //             nav?.classList.remove('scrolled');
    //         }
    //     }

    //     document.addEventListener('scroll', navScroll);
    // })

    const nav = document.getElementById('nav');

    function navScroll () {
        if (window.scrollY > 150) {
            nav?.classList.add('scrolled');
        } else {
            nav?.classList.remove('scrolled');
        }
    }

    document.addEventListener('scroll', navScroll);

    const navUiRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const uiItems = gsap.utils.toArray<HTMLElement>('.nav-ui-item');
        
        uiItems.forEach((item) => {
            // const icon = item.querySelector('.nav-ui-icon');
            const text = item.querySelector('p');
            
            if (!text) return;

            gsap.set(text, { 
                opacity: 0,
                width: 0,
                display: 'none'
            });

            item.addEventListener('mouseenter', () => {
                gsap.killTweensOf(text);

                gsap.set(text, { display: 'block' });

                gsap.to(text, {
                    opacity: 1,
                    width: 'auto',
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });

            item.addEventListener('mouseleave', () => {
                gsap.killTweensOf(text);

                gsap.to(text, {
                    opacity: 0,
                    width: 0,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => {
                        gsap.set(text, { display: 'none' });
                    }
                });
            });
        });

        return () => {
            uiItems.forEach((item) => {
                item.removeEventListener('mouseenter', () => {});
                item.removeEventListener('mouseleave', () => {});
            });
        };
    }, { scope: navUiRef });
    
    return (
        <nav id='nav' className='nav'>
            <div className='nav-links'>
                <a href="javascript:void()">Nuevo</a>
                <a href="javascript:void()">Outlet</a>
                <a href="javascript:void()">Hombre</a>
                <a href="javascript:void()">Mujer</a>
                <a href="javascript:void()">Categorías</a>
            </div>
            <div className='nav-brand'>
                <a href="/"><img src={LogoCafe} alt="Velez Logo" /></a>
            </div>
            <div className='nav-ui' ref={navUiRef}>
                <a href="/">
                    <div className='nav-ui-item'>
                        <i className={totalItems < 1 ? 'spacing-right nav-ui-icon fi fi-rr-user' : 'nav-ui-icon fi fi-rr-user'}></i>
                    </div>
                </a>
                <a onClick={toggleCart}>
                    <div className='nav-ui-item'>
                        <div className={totalItems < 1 ? 'hidden' : ''}>{totalItems < 1 ? '' : totalItems}</div>
                        <i className='nav-ui-icon fi fi-rr-shopping-cart'></i>
                        <p>
                            {pesoFormat(totalPrice)}
                        </p>
                    </div>
                </a>
            </div>
        </nav>
    );
}

export default NavCart