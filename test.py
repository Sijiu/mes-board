# -*- coding: utf-8 -*-


def fab(max):
    n, a, b, = 0, 0, 1
    while n < max:
        print b
        a, b = b, a+b
        n += 1


def fab2(max):
    n, a, b = 0, 0, 1
    l = []
    while n < max:
        l.append(b)
        a, b = b, a+b
        n += 1
    return l


class Fab(object):

    def __init__(self, max):
        self.max = max
        self.n, self.a, self.b = 0, 0, 1

    def __iter__(self):
        return self

    def next(self):
        if self.n < self.max:
            r = self.b
            self.a, self.b = self.b, self.a + self.b
            self.n += 1
            return r
        raise StopIteration()


def fab_yield(max):
    n, a, b = 0, 0, 1
    while n < max:
        yield b
        a, b = b, a+b
        n += 1

# fab(4)
# for i in fab2(5):
#     print i

for n in Fab(5):
    print n
    if n == 3:
        # print n
        break







