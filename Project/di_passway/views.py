from django.shortcuts import render
from django import http
from django.core import serializers
from django.utils.text import compress_string
from django.http import HttpResponse

import re
#import gearman
import json
from models import Employee

XS_SHARING_ALLOWED_ORIGINS = "*"
XS_SHARING_ALLOWED_METHODS = ["POST","GET","OPTIONS", "PUT", "DELETE"]

JSON_RES = {"Code":0, "Msg":"", "CATEGORY":"", "IDX":-1, "NAME":"", "DATA":{}}
LOGFILE = "hdfs://cdh4-n.migosoft.com/user/athena/person_all/"
D1_MAP = {
    "member": "0:MemberID:C",
    "shop": "1:ShopID:C",
    "freq": "2:Frequency:C",
    "money": "3:Money:N",
    "nes": "5:NES:C",
    "l": "6:L:C",
    "r": "7:R:C",
    "f": "8:F:C",
    "m": "9:M:C",
    "gender": "10:Gender:C",
    "age": "11:AgeGroup:C",
    "province": "12:Province:C",
    "education": "13:Education:C"
}

def _response(data, is_encoded):
    if not is_encoded:
        data = json.dumps(data, ensure_ascii="False")

    response = http.HttpResponse(data)
    response.__setitem__("Content-type", "application/json; charset=utf-8")
    response.__setitem__("Access-Control-Allow-Origin", "*")

    return response
    #return http.HttpResponse(data, content_type="application/json; charset=utf-8")

def index(request):
    return HttpResponse("You're voting on question %s." % 'A')
    #return render(request, "index.html", {})


def home(request):
    data = None
    obj = {"username":'wendell'}
    return render(request, "order.html", {"json": obj})

'''
def d1(request, type):
    data = dict(JSON_RES)
    is_encoded = False
    if type.lower() in D1_MAP:
        param = "-d {} -i {}".format(D1_MAP[type.lower()], LOGFILE) 
        try:
            gm_client = gearman.GearmanClient(["10.0.1.22"])
            print "Sending job..."
            client = gm_client.submit_job("lemon1d", param)
            data = client.result
            is_encoded = True
        except Exception as ex:
            data["Code"] = 1
            data["Msg"] = str(ex) 
    else:
        data["Code"] = 1
        data["Msg"] = "Wrong Spark Parameters"

    return _response(data, is_encoded)

def d2(request, type1, type2):
    data = dict(JSON_RES)
    is_encoded = False
    if type1.lower() in D1_MAP and type2.lower() in D1_MAP:
        param = "-d {},{} -i {}".format(D1_MAP[type1.lower()], D1_MAP[type2.lower()], LOGFILE)
        try:
            gm_client = gearman.GearmanClient(["10.0.1.22"])
            print "Sending job..."
            client = gm_client.submit_job("lemon2d", param)
            data = client.result
            #data = '{"Code":0, "Msg":"", "CATEGORY":"", "IDX":-1, "NAME":"", "DATA":{}}'
            is_encoded = True
        except Exception as ex:
            data["Code"] = 1
            data["Msg"] = str(ex)
    else:
        data["Code"] = 1
        data["Msg"] = "Wrong Spark Parameters"

    return _response(data, is_encoded)
    #return render(request, "core/test.html", {'type': data})

def d3(request, type1, type2, type3):
    data = dict(JSON_RES)
    is_encoded = False
    if type1.lower() in D1_MAP and type2.lower() in D1_MAP and type3.lower() in D1_MAP:
        param = "-d {},{},{} -i {}".format(D1_MAP[type1.lower()], D1_MAP[type2.lower()], D1_MAP[type3.lower()], LOGFILE)
        try:
            gm_client = gearman.GearmanClient(["10.0.1.22"])
            print "Sending job..."
            client = gm_client.submit_job("lemon3d", param)
            data = client.result
            #data = '{"Code":0, "Msg":"", "CATEGORY":"", "IDX":-1, "NAME":"", "DATA":{}}'
            is_encoded = True
        except Exception as ex:
            data["Code"] = 1
            data["Msg"] = str(ex)
    else:
        data["Code"] = 1
        data["Msg"] = "Wrong Spark Parameters"

    return _response(data, is_encoded)
    #return render(request, "core/test.html", {'type': data})

def shopinfo(request, type):

    data = dict(JSON_RES)
    LOGFILE2 = "hdfs://cdh4-n.migosoft.com/user/athena/daily_total_hive/"
    is_encoded = False
    
    param = "-d {} -i {}".format(type.lower(), LOGFILE2)
    try:
        gm_client = gearman.GearmanClient(["10.0.1.22"])
        print "Sending job..."
        client = gm_client.submit_job("shopinfo", param)
        data = client.result
            #data = '{"Code":0, "Msg":"", "CATEGORY":"", "IDX":-1, "NAME":"", "DATA":{}}'
        is_encoded = True
    except Exception as ex:
        data["Code"] = 1
        data["Msg"] = str(ex)

    return _response(data, is_encoded)
'''




def save(request):
    employee = Employee.objects.create(
        email="pedro.kong@company.com",
        first_name="Pedro",
        last_name="Kong"
    )
    employee.save()
    return render(request, "core/index.html", {})

def demo(request):
    return render(request, "demo.html", {})
