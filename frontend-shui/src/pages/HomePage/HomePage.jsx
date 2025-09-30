// import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../../components/Logo/Logo';


const HomePage = () => {
    const navigate = useNavigate();
    return (
        <section className="home-page">
            <Logo />
        </section>
    )
}

export default HomePage;