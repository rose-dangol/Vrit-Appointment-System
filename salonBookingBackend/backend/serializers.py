from rest_framework import serializers
from .models import Service, Booking

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    serviceName = serializers.CharField(source='service.name', read_only=True)
    serviceId = serializers.PrimaryKeyRelatedField(source='service', queryset=Service.objects.all())
    date = serializers.DateField(source='app_date')
    time = serializers.TimeField(source='app_time')

    class Meta:
        model = Booking
        fields = ['id', 'customerName', 'customerPhone', 'serviceId', 'serviceName', 'date', 'time', 'status', 'notes']
        extra_kwargs = {
            'notes': {'required': False, 'allow_blank': True}
        }

    def validate(self, data):
        service = data.get('service', getattr(self.instance, 'service', None))
        app_date = data.get('app_date', getattr(self.instance, 'app_date', None))
        app_time = data.get('app_time', getattr(self.instance, 'app_time', None))

        query = Booking.objects.filter(service=service, app_date=app_date, app_time=app_time)
        if self.instance:
            query = query.exclude(pk=self.instance.pk)

        if query.exists():
            raise serializers.ValidationError("This time slot is already booked for the selected service.")
        return data
