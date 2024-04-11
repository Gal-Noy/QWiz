import React from "react";
import { formatDate } from "../../utils/generalUtils";

function FreeSearchThreadBlock({ thread }) {
  return (
    <li
      className="free-search-list-item"
      key={thread._id}
      onClick={() => (window.location.href = `/threads/${thread._id}`)}
    >
      <div className="free-search-list-item-main-details">
        <a>{thread.title}</a>
        <div className="free-search-list-item-comments-views">
          <div className="free-search-list-item-comments-views-pair">
            <span className="material-symbols-outlined">comment</span>
            {thread.comments.length}
          </div>
          <div className="free-search-list-item-comments-views-pair">
            <span className="material-symbols-outlined">visibility</span>
            {thread.views}
          </div>
        </div>
      </div>
      <div className="free-search-list-item-secondary-details">
        <div className="free-search-list-item-secondary-details-pair">
          <a className="secondary-details-pair-key">נוצר בתאריך: </a>
          <a className="secondary-details-pair-value">{formatDate(thread.createdAt)}</a>
        </div>
        <div className="free-search-list-item-secondary-details-pair">
          <a className="secondary-details-pair-key">נפתח ע"י: </a>
          <a className="secondary-details-pair-value">{thread.creator.name}</a>
        </div>
        <div className="free-search-list-item-secondary-details-pair">
          <a className="secondary-details-pair-key">תגיות: </a>
          <a className="secondary-details-pair-value">{thread.tags.map((tag) => `#${tag}`).join(", ")}</a>
        </div>
      </div>
    </li>
  );
}

export default FreeSearchThreadBlock;
