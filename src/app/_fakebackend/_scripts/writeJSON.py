import json

aList = [{"a":54, "b":87}, {"c":81, "d":63}, {"e":17, "f":39}]
jsonString = json.dumps(aList)
jsonFile = open("src/app/_fakebackend/_users/data.json", "w")
jsonFile.write(jsonString)
jsonFile.close()