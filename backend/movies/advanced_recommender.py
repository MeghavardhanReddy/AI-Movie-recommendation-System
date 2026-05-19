import pandas as pd
import joblib

# =========================
# LOAD DATASETS
# =========================

movies = pd.read_csv(
    '../datasets/ml-latest-small/movies.csv'
)

ratings = pd.read_csv(
    '../datasets/ml-latest-small/ratings.csv'
)

# =========================
# LOAD SAVED MODELS
# =========================

svd_model = joblib.load(
    '../ml-engine/saved_models/svd_model.pkl'
)

tfidf = joblib.load(
    '../ml-engine/saved_models/tfidf.pkl'
)

cosine_sim = joblib.load(
    '../ml-engine/saved_models/cosine_sim.pkl'
)

indices = joblib.load(
    '../ml-engine/saved_models/indices.pkl'
)

print("Saved AI Models Loaded Successfully!")

# =========================
# ADVANCED HYBRID AI
# =========================

def hybrid_recommendation(
    movie_title,
    user_id=1,
    top_n=10
):

    try:

        idx = indices[movie_title]

    except:

        return ["Movie not found"]

    # Content similarity
    sim_scores = list(
        enumerate(cosine_sim[idx])
    )

    sim_scores = sorted(
        sim_scores,
        key=lambda x: x[1],
        reverse=True
    )

    sim_scores = sim_scores[1:30]

    movie_indices = [
        i[0] for i in sim_scores
    ]

    candidate_movies = movies.iloc[
        movie_indices
    ][['movieId', 'title']]

    predictions = []

    # Collaborative filtering score
    for _, row in candidate_movies.iterrows():

        predicted_rating = svd_model.predict(
            user_id,
            row['movieId']
        ).est

        predictions.append(
            (
                row['title'],
                predicted_rating
            )
        )

    # Sort predictions
    predictions.sort(
        key=lambda x: x[1],
        reverse=True
    )

    # Top recommendations
    recommendations = [
        movie[0]
        for movie in predictions[:top_n]
    ]

    return recommendations