import React from "react";
import NavBar from "../components/NavBar";
import HomePageInfoBlock from "../components/HomePage/HomePageInfoBlock";
import "../styles/HomePage.css";

function HomePage({ onLogout }) {
  return (
    <div className="qwiz-div">
      <NavBar onLogout={onLogout} />
      <div className="qwiz-main-div">
        <div className="qwiz-main-logo">QWiz</div>
        <div className="qwiz-main-text-headline">הפתרון המושלם לסטודנטים שרוצים להצליח בבחינות</div>
        <div className="qwiz-main-blocks">
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
      </div>
      <div className="homepage-buttons">
        <button className="homepage-button">מאגר המבחנים</button>
        <button className="homepage-button">העלאת מבחן</button>
        <button className="homepage-button">פורומים</button>
        <button className="homepage-button">הפרופיל שלי</button>
      </div>
      <h1>ברוכים הבאים לQwiz!</h1>
    </div>
  );
}

export default HomePage;
