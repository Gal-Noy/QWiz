import React from "react";
import { Link } from "react-router-dom";
import HomePageInfoBlock from "../components/HomePage/HomePageInfoBlock";
import "../styles/HomePage.css";

function HomePage({ onLogout }) {
  return (
    <div className="homepage-div">
      <div className="homepage-main-div">
        <div className="homepage-main-logo">QWiz</div>
        <div className="homepage-main-text-headline">הפתרון המושלם לסטודנטים שרוצים להצליח בבחינות</div>
        <div className="homepage-main-blocks">
          <HomePageInfoBlock
            id={1}
            title="מאגר מבחנים מקיף"
            explanation="כאן תוכלו למצוא מאגר מבחנים מקיף עם מגוון רחב של שאלות ומבחנים בכל נושאים הקשורים ללמידה ולהוראה."
          />
          <HomePageInfoBlock
            id={2}
            title="חיפוש מתקדם"
            explanation="ניתן לחפש במאגר המבחנים באמצעות חיפוש מתקדם שמאפשר סינון לפי נושא, רמת קושי, סוג שאלה ועוד."
          />
          <HomePageInfoBlock
            id={3}
            title="תרומה לקהילה ולמידה קולקטיבית"
            explanation="באמצעות תרומתכם תוכלו לתרום מבחנים משלכם למאגר המבחנים ולהוסיף לקהילת המשתמשים."
          />
          <HomePageInfoBlock
            id={4}
            title="ניהול העדפות ופרופיל אישי"
            explanation="אפשרות לנהל העדפות אישיות וליצור פרופיל אישי המאפשר שמירה ושיתוף במבחנים."
          />
        </div>
        <div className="homepage-buttons">
          <Link to="/exams" className="homepage-button">
            מאגר המבחנים
          </Link>
          <button className="homepage-button">העלאת מבחן</button>
          <button className="homepage-button">פורומים</button>
          <button className="homepage-button">הפרופיל שלי</button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
