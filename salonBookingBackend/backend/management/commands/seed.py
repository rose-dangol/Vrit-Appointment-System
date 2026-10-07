from django.core.management.base import BaseCommand
from backend.models import Service, Booking
from datetime import date, time
import datetime

class Command(BaseCommand):
    help = 'Seed the database with initial sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # Clear existing data
        Service.objects.all().delete()
        Booking.objects.all().delete()

        # Create Services
        services_data = [
            {'name': 'Haircut', 'price': 25.00, 'duration': 30},
            {'name': 'Hair Coloring', 'price': 85.00, 'duration': 120},
            {'name': 'Manicure', 'price': 20.00, 'duration': 45},
            {'name': 'Pedicure', 'price': 30.00, 'duration': 60},
            {'name': 'Facial', 'price': 50.00, 'duration': 60},
            {'name': 'Massage', 'price': 70.00, 'duration': 90},
        ]

        services = []
        for s_data in services_data:
            service = Service.objects.create(**s_data)
            services.append(service)

        self.stdout.write(f'Created {len(services)} services.')

        # Create Bookings
        today = date.today()
        tomorrow = today + datetime.timedelta(days=1)
        
        bookings_data = [
            {
                'customerName': 'Rose D',
                'customerPhone': '1234567890',
                'service': services[0],
                'app_date': today,
                'app_time': time(10, 0),
                'status': 'Confirmed',
            },
            {
                'customerName': 'Julian Baker',
                'customerPhone': '98765435610',
                'service': services[1], # Hair Coloring
                'app_date': today,
                'app_time': time(14, 30),
                'status': 'Pending',
                'notes': 'blonde'
            },
            {
                'customerName': 'Phoebe Bridgers',
                'customerPhone': '1234567890',
                'service': services[4], # Facial
                'app_date': tomorrow,
                'app_time': time(11, 0),
                'status': 'Completed',
                'notes': ''
            },
        ]

        for b_data in bookings_data:
            Booking.objects.create(**b_data)

        self.stdout.write(f'Created {len(bookings_data)} bookings.')
        self.stdout.write(self.style.SUCCESS('Successfully seeded database!'))
