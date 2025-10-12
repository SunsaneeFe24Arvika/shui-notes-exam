const FooterItem = ({footerItem}) => {
    return (
        <li className="footer__item">
            <button onClick={footerItem.action} className="footer__link">
                <span className="footer-icon">
                    {footerItem.icon}
                </span>
                <span className="footer-text">
                    {footerItem.name}
                </span>
            </button>
        </li>
    )
}

export default FooterItem;