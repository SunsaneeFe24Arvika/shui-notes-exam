import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../../components/Logo/Logo';
import NavBar from "../../components/NavBar/NavBar";

const HomePage = () => {
    const namigate = useNavigate();
    return (
        <section className="home-page">
            <Logo />
            <NavBar />
        </section>
    )
}

export default HomePage;