const SUPABASE_URL = "https://crasvvnewgwpsxhjbufw.supabase.co";
const SUPABASE_KEY = "sb_publishable_l7RoTPG1g6Ym1Heh3Z-6CA_gX2jfOjD";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* ================= LOAD REVIEWS ================= */

window.loadReviews = async function () {

    const { data, error } = await supabaseClient
        .from("reviews")
        .select("name, rating, message")
        .eq("approved", true)
        .order("id", { ascending: false });

    if (error) {
        console.error("Review loading error:", error);
        return;
    }

    const reviewsList = document.getElementById("reviewsList");

    if (!reviewsList) return;

    reviewsList.innerHTML = "";

    data.forEach(review => {

        const card = document.createElement("article");

        card.className = "review-card";

        const rating = Number(review.rating) || 0;
        const stars = "★★★★★".slice(0, rating);

        card.innerHTML = `
            <div class="stars">${stars}</div>
            <p>${escapeHTML(review.message)}</p>
            <h3>${escapeHTML(review.name)}</h3>
            <small>Customer Review</small>
        `;

        reviewsList.appendChild(card);
    });
};


/* ================= SUBMIT REVIEW ================= */

window.submitReview = async function () {

    console.log("SUBMIT REVIEW CLICKED");

    const nameElement = document.getElementById("reviewName");
    const ratingElement = document.getElementById("reviewRating");
    const messageElement = document.getElementById("reviewMessage");

    if (!nameElement || !ratingElement || !messageElement) {
        console.error("Review form elements not found.");
        alert("Review form error. Please refresh the page.");
        return;
    }

    const name = nameElement.value.trim();
    const rating = Number(ratingElement.value);
    const message = messageElement.value.trim();

    if (!name || !message) {
        alert("Please enter your name and review.");
        return;
    }

    const { data, error } = await supabaseClient
        .from("reviews")
        .insert({
            name: name,
            rating: rating,
            message: message,
            approved: false
        })
        .select();

    if (error) {

        console.error("SUPABASE INSERT ERROR:", error);

        alert(
            "Unable to submit review.\n\n" +
            error.message
        );

        return;
    }

    console.log("Review submitted:", data);

    nameElement.value = "";
    messageElement.value = "";

    if (typeof closeReviewForm === "function") {
        closeReviewForm();
    }

    alert(
        "Thank you! Your review has been submitted for approval."
    );

    loadReviews();
};


/* ================= SECURITY ================= */

window.escapeHTML = function (text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
};


/* ================= START ================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log("SUPABASE.JS LOADED");

        loadReviews();

    }
);