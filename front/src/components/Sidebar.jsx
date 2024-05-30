import React from 'react'
import { useState } from "react";
import { Link, NavLink, useParams } from 'react-router-dom';
import { RiMoonClearLine } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useStateContext } from '../context/Provider';
import { GrConfigure } from "react-icons/gr";
import { GoFileSubmodule } from "react-icons/go";
import { FaCalendarAlt } from "react-icons/fa";
import { MdVideoChat } from "react-icons/md";
import { IoHome } from "react-icons/io5";
import { FiEdit } from 'react-icons/fi';
import { BsKanban } from 'react-icons/bs';
import { IoMdContacts } from 'react-icons/io';
import { RiContactsLine } from 'react-icons/ri';
import { useProject } from '../context/projectContext';
import { links } from '../data/dummy';

const Sidebar = () => {
  const { activeMenu, setActiveMenu, screenSize, currentColor } = useStateContext();
  const { id } = useParams();
  const { userRole } = useProject();


  const handleCloseSideBar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
    
  }
  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  return (
    <div className='ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10'>
      {activeMenu && (<>
        <div className='flex justify-between items-center mt-8'>
          <Link to="/" onClick={handleCloseSideBar} className='items-center gap-3 ml-3 ,t-4 flex text-xl
                font-extrabold tracking-tight dark:text-white text-slate-900'  >
            <RiMoonClearLine /> <span>CLEAR</span>
          </Link>
          <TooltipComponent content="Menu" position='BottomCenter'>
            <button type='button' onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)} className='text-xl rounded-full p-3 
                    hover:bg-light-gray mt-4 block md:hidden'>
              <MdCancel />
            </button>
          </TooltipComponent>
        </div>
        <div className='mt-10'>
            {links.map((item) => (
              <div key={item.title}>
                <p className='text-gray-400 m-3 mt-4 uppercase'>{item.title}</p>
                {item.links.map((link) => (
                  link.isAdmin === userRole || !link.isAdmin ? (
                    <NavLink
                      to={`/Proyecto/${id}/${link.url}`}
                      key={link.name}
                      onClick={handleCloseSideBar}
                      style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '' })}
                      className={({ isActive }) => isActive ? activeLink : normalLink}>
                      {link.icon}
                      <span className='capitalize'>{link.name}</span>
                    </NavLink>
                  ) : null
                ))}
              </div>
            ))}
          </div>


        {/*userRole &&
          <div className='mt-10'>
            <p className='text-gray-400 m-3 mt-4 uppercase'>
              DASHBOARD
            </p>
            <NavLink to={`/Proyecto/${id}/`}
              onClick={handleCloseSideBar}
              style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '' })}
              className={({ isActive }) => isActive ? activeLink : normalLink}>
              <IoHome />
              <span className='capitalize'>
                Dashboard
              </span>

            </NavLink>
            <p className='text-gray-400 m-3 mt-4 uppercase'>
              PÁGINAS
            </p>
            <NavLink to={`/Proyecto/${id}/Asignartarea`}
              onClick={handleCloseSideBar}
              style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '' })}
              className={({ isActive }) => isActive ? activeLink : normalLink}>
              <IoMdContacts />
              <span className='capitalize'>
                Asignar tarea
              </span>

            </NavLink>

            <NavLink to={`/Proyecto/${id}/Entregas`}
              onClick={handleCloseSideBar}
              style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '' })}
              className={({ isActive }) => isActive ? activeLink : normalLink}>
              <GoFileSubmodule />
              <span className='capitalize'>
                Entregas
              </span>
            </NavLink>

            <NavLink to={`/Proyecto/${id}/Participantes`}
              onClick={handleCloseSideBar}
              style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '' })}
              className={({ isActive }) => isActive ? activeLink : normalLink}>
              <RiContactsLine />
              <span className='capitalize'>
                Usuarios
              </span>
            </NavLink>

            <p className='text-gray-400 m-3 mt-4 uppercase'>
              APLICACIONES
            </p>

            <NavLink to={`/Proyecto/${id}/Calendario`}
              onClick={handleCloseSideBar}
              style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '' })}
              className={({ isActive }) => isActive ? activeLink : normalLink}>
              <FaCalendarAlt />
              <span className='capitalize'>
                Calendario
              </span>
            </NavLink>

            <NavLink to={`/Proyecto/${id}/Kanban`}
              onClick={handleCloseSideBar}
              style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '' })}
              className={({ isActive }) => isActive ? activeLink : normalLink}>
              <BsKanban />
              <span className='capitalize'>
                Kanban
              </span>
            </NavLink>

            <NavLink to={`/Proyecto/${id}/Chat`}
              onClick={handleCloseSideBar}
              style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '' })}
              className={({ isActive }) => isActive ? activeLink : normalLink}>
              <FiEdit />
              <span className='capitalize'>
                Chat
              </span>
            </NavLink>

            <NavLink to={`/Proyecto/${id}/VideoChat`}
              onClick={handleCloseSideBar}
              style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '' })}
              className={({ isActive }) => isActive ? activeLink : normalLink}>
              <MdVideoChat />
              <span className='capitalize'>
                Videochat
              </span>
            </NavLink>


            <NavLink to={`/Proyecto/${id}/Configuracion`}
              onClick={handleCloseSideBar}
              style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '' })}
              className={({ isActive }) => isActive ? activeLink : normalLink}>
              <GrConfigure />
              <span className='capitalize'>
                Configuracion
              </span>
            </NavLink>
          </div>
        </div>*/}
        {/*!userRole &&
          <div className='mt-10'>
            <p className='text-gray-400 m-3 mt-4 uppercase'>
              DASHBOARD
            </p>
            <NavLink to={`/Proyecto/${id}`}
              onClick={handleCloseSideBar}
              style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '' })}
              className={({ isActive }) => isActive ? activeLink : normalLink}>
              <IoHome />
              <span className='capitalize'>
                Dashboard
              </span>

            </NavLink>
            <p className='text-gray-400 m-3 mt-4 uppercase'>
              APLICACIONES
            </p>

            <NavLink to={`/Proyecto/${id}/Calendario`}
              onClick={handleCloseSideBar}
              style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '' })}
              className={({ isActive }) => isActive ? activeLink : normalLink}>
              <FaCalendarAlt />
              <span className='capitalize'>
                Calendario
              </span>
            </NavLink>

            <NavLink to={`/Proyecto/${id}/Kanban`}
              onClick={handleCloseSideBar}
              style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '' })}
              className={({ isActive }) => isActive ? activeLink : normalLink}>
              <BsKanban />
              <span className='capitalize'>
                Kanban
              </span>
            </NavLink>

            <NavLink to={`/Proyecto/${id}/Chat`}
              onClick={handleCloseSideBar}
              style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '' })}
              className={({ isActive }) => isActive ? activeLink : normalLink}>
              <FiEdit />
              <span className='capitalize'>
                Chat
              </span>
            </NavLink>

            <NavLink to={`/Proyecto/${id}/Videochat`}
              onClick={handleCloseSideBar}
              style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '' })}
              className={({ isActive }) => isActive ? activeLink : normalLink}>
              <MdVideoChat />
              <span className='capitalize'>
                Videochat
              </span>
            </NavLink>


          </div>
      */}
      </>)}

    </div>
  )
}
export default Sidebar;
