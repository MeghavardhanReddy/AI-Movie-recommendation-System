import pandas as pd
import joblib

from accounts.models import (
    FavoriteMovie,
    WatchedMovie
)

# =========================
# LOAD DATASETS
# =========================

movies = pd.read_csv(
    '../datasets/ml-latest-small/movies.csv'
)

# =========================
# LOAD SAVED MODELS
# =========================

svd_model = joblib.load(
    '../ml-engine/saved_models/svd_model.pkl'
)

cosine_sim = joblib.load(
    '../ml-engine/saved_models/cosine_sim.pkl'
)

indices = joblib.load(
    '../ml-engine/saved_models/indices.pkl'
)

# =========================
# USER PREFERENCE LEARNING
# =========================

def get_user_preferences(user):

    favorite_movies = FavoriteMovie.objects.filter(
        user=user
    )

    watched_movies = WatchedMovie.objects.filter(
        user=user
    )

    user_preferences = []

    # FAVORITES GET HIGHER WEIGHT

    for movie in favorite_movies:

        user_preferences.append({
            "title": movie.movie_title,
            "weight": 3
        })

    # WATCH HISTORY GETS MEDIUM WEIGHT

    for movie in watched_movies:

        user_preferences.append({
            "title": movie.movie_title,
            "weight": 1.5
        })

    return user_preferences
# =========================
# PERSONALIZED AI
# =========================

def personalized_recommendation(

    movie_title,
    user,
    top_n=10

):

    try:

        idx = indices[movie_title]

    except:

        return ["Movie not found"]

    sim_scores = list(
        enumerate(cosine_sim[idx])
    )

    sim_scores = sorted(
        sim_scores,
        key=lambda x: x[1],
        reverse=True
    )

    sim_scores = sim_scores[1:40]

    movie_indices = [
        i[0] for i in sim_scores
    ]

    candidate_movies = movies.iloc[
        movie_indices
    ][['movieId', 'title', 'genres']]

    user_preferences = get_user_preferences(
        user
    )

    predictions = []

    for _, row in candidate_movies.iterrows():

        predicted_rating = svd_model.predict(
            user.id,
            row['movieId']
        ).est

        preference_bonus = 0

        for pref_movie in user_preferences:

            if pref_movie["title"].lower() in row['title'].lower():

                preference_bonus += pref_movie["weight"]

        final_score = (
            predicted_rating +
            preference_bonus
        )

        predictions.append(

            (
                row['title'],
                final_score
            )

        )

    predictions.sort(
        key=lambda x: x[1],
        reverse=True
    )

    recommendations = [

        movie[0]
        for movie in predictions[:top_n]

    ]

    return recommendations