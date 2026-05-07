import hashlib
import time

path = r'C:\Users\wwwad\PycharmProjects\blockchain\image.png'

# with open(path, 'rb') as opened_file:
#     content = opened_file.read()
#     md5 = hashlib.md5()
#     sha1 = hashlib.sha1()
#     sha224 = hashlib.sha224()
#     sha256 = hashlib.sha256()
#     sha384 = hashlib.sha384()    
#     sha512 = hashlib.sha512()
    
#     md5.update(content)
#     sha1.update(content)
#     sha224.update(content)
#     sha256.update(content)
#     sha384.update(content)
#     sha512.update(content)
    
    
#     print('result')
#     print()
#     print(f'{md5.name}: {md5.hexdigest()}')
#     print(f'{sha1.name}: {sha1.hexdigest()}')
#     print(f'{sha224.name}: {sha224.hexdigest()}')
#     print(f'{sha256.name}: {sha256.hexdigest()}')
#     print(f'{sha384.name}: {sha384.hexdigest()}')
#     print(f'{sha512.name}: {sha512.hexdigest()}')
t1 = time.time()   
print(f"star time {time.time()-t1}")
md5 = hashlib.md5()
sha1 = hashlib.sha1()
sha224 = hashlib.sha224()
sha256 = hashlib.sha256()
sha384 = hashlib.sha384()    
sha512 = hashlib.sha512()
t2 = time.time()
print(f"star time1 {time.time()-t2}")

list_hash_object = [md5,sha1,sha224,sha256,sha384,sha512]
t3 = time.time()
print(f"star time2{time.time()-t3}")
with open(path, 'rb') as opened_file:
    t4 = time.time()
    print(f"star time3 {time.time()-t4}")
    print("Result")
    print()
    content = opened_file.read()
    t5 = time.time()
    print(f"star time4 {time.time()-t5}")
    
    for hash_objet in list_hash_object:
        # print("star time5",time.time())
        hash_objet.update(content)
        # print("star time6",time.time())
        print(f'{hash_objet.name}: {hash_objet.hexdigest()}')
        # print("star time7",time.time())
t6 = time.time()
print(f"star time8 {time.time()-t6}")
print(f"TIME:{t1+t2+t3+t4+t5+t6}")
       