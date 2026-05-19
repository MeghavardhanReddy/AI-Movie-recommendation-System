from rest_framework.decorators import api_view
from rest_framework.response import Response

from .hybrid_recommender import hybrid_recommendation
@api_view(['GET'])
def recommend_movies(request):

    user_id = request.GET.get('user_id', 1)

    movie = request.GET.get('movie')

    recommendations = hybrid_recommendation(
        movie_title=movie,
        user_id=int(user_id)
    )

    return Response({
        "recommendations": recommendations
    })