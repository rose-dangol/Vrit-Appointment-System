from django.db import  models

class Service(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(decimal_places=2, max_digits=10)
    duration = models.IntegerField()
    def __str__(self):
        return self.name

    class Meta:
        db_table = 'salonService'
        app_label = 'backend'

class Booking(models.Model):
    customerName = models.CharField(max_length=100)
    customerPhone = models.CharField(max_length=100)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    app_date = models.DateField()
    app_time = models.TimeField()
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    notes = models.TextField()
    def __str__(self):
        return self.customerName
    class Meta:
        db_table = 'salonBooking'
