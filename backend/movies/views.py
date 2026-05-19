from pathlib import Path

from django.http import JsonResponse
from rest_framework.decorators import api_view

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


BASE_DIR = Path(__file__).resolve().parent.parent

movies_path = BASE_DIR.parent / 'datasets' / 'ml-latest-small' / 'movies.csv'

movies = pd.read_csv(movies_path)

# Fill missing values
movies['genres'] = movies['genres'].fillna('')

# TF-IDF
tfidf = TfidfVectorizer(stop_words='english')

tfidf_matrix = tfidf.fit_transform(movies['genres'])

# Similarity matrix
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

# Index mapping
indices = pd.Series(movies.index, index=movies['title']).drop_duplicates()


@api_view(['GET'])
def recommend_movies(request):

    movie_title = request.GET.get('movie')

    if not movie_title:
        return JsonResponse({
            "error": "Movie name is required"
        })

    movie_title = movie_title.lower()

    matching_movies = movies[
        movies['title'].str.lower().str.contains(movie_title)
    ]

    if matching_movies.empty:
        return JsonResponse({
            "error": "Movie not found"
        })

    selected_movie = matching_movies.iloc[0]['title']

    idx = indices[selected_movie]

    similarity_scores = list(enumerate(cosine_sim[idx]))

    similarity_scores = sorted(
        similarity_scores,
        key=lambda x: x[1],
        reverse=True
    )

    similarity_scores = similarity_scores[1:6]

    movie_indices = [i[0] for i in similarity_scores]

    recommendations = movies['title'].iloc[movie_indices].tolist()

    return JsonResponse({
        "selected_movie": selected_movie,
        "recommendations": recommendations
    })