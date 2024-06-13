import React, {useEffect,useState} from 'react'
import { AiOutlineMenu } from 'react-icons/ai';
import { BsChatLeft } from 'react-icons/bs';
import {  RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import Notificacion from './Notificacion';
import {Cart,Chat, PerfilUsuario} from ".";
import { useStateContext } from '../context/Provider'; 
import { useAuth } from '../context/authContext';
import { useProject } from '../context/projectContext';

const NavButton = ({title, customFunc, icon, color, dotColor}) => (
    <TooltipComponent content={title} position='BottomCenter'>
       <button type='button' onClick={customFunc} style = {{color}} className='relative text-xl rounded-full p-3 hover:bg-light-gray'> 
          <span style={{background: dotColor}} className='absolute inline-flex rounded-full h-2 w-2 right-2 top-2'/>
            {icon}
       </button>
    </TooltipComponent>
)

const Navbar = () => {
  const { user } = useAuth();
  const {activeMenu,setActiveMenu, isClicked, setIsClicked, handleClick, screenSize, setScreenSize, currentColor} = useStateContext();
  const {notificaciones}=useProject();
  const [contadorNotificaciones, setContadorNotificaciones] = useState(0);

  useEffect(() => {
      const handleResize = () => setScreenSize(window.innerWidth);

      window.addEventListener('resize', handleResize);
      handleResize();
      setIsClicked(false);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if(screenSize <= 900){
      setActiveMenu(false);
    } else{
      setActiveMenu(true);
    }
  }, [screenSize]);

  useEffect(()=>{
    let contador=0;
    notificaciones?.map((notificacion)=>{
      if(notificacion.ESTADO_VISUALIZACION === 0){
        contador++;
      }
      setContadorNotificaciones(contador);
    })
  },[notificaciones]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);
  return (
    <div className='flex w-full p-2 md:mx-6 relative'>
      <div className='flex justify-start w-1/12'>
        <NavButton title="Menu" customFunc={handleActiveMenu} color= {currentColor} icon= {<AiOutlineMenu/>} />
      </div>
      <div className='flex justify-end w-11/12 mr-5'> 
            <NavButton title="Chat" customFunc={() => handleClick('chat')} color= {currentColor} icon= {<BsChatLeft/>} />  
            <NavButton title="Notificaciones" customFunc={() => handleClick("notificacion")} color= {currentColor} icon= {<RiNotification3Line/>} />
            {/*contadorNotificaciones > 0 ? <div className="text-white text-xs rounded-full mt-3 mb-3  p-1 px-2 bg-orange-500 "> {contadorNotificaciones}</div> : [] */}

            <TooltipComponent content= "Profile" position='BottomCenter'>
              <div className='flex items-center gap-2 cursor-pointer p-2 mt-2 hover:bg-light-gray rounded-lg' onClick={() => handleClick('perfilUsuario')}>
                  <p>
                    <span className='text-gray-400  text-14'> Hola, </span>
                    <span className='text-gray-400 font-bold ml-1 text-14'> {user.NOMBRE_PILA}</span>
                  </p>
                  <MdKeyboardArrowDown className='text-gray-400  text-14'/>

              </div>
            </TooltipComponent>
            {isClicked.cart && <Cart />}
            {isClicked.chat && <Chat />}
            {isClicked.notificacion && <Notificacion />}
            {isClicked.perfilUsuario && <PerfilUsuario />}
        </div>
    </div>
  )
}
 export default Navbar;