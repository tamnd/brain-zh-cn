---
title: "CF 106098I - MEDAA 和 Totients"
description: "对于每个数字 $ai$，Meda 计算 $$f(ai)=prod{p mid ai}left(1-frac1pright)$$，其中乘积运行在 $ai$ 的不同质因数上。"
date: "2026-06-25T11:56:12+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106098
codeforces_index: "I"
codeforces_contest_name: "The American University in Cairo CSEA Fall 2025 contest"
rating: 0
weight: 106098
solve_time_s: 60
verified: true
draft: false
---

[CF 106098I - MEDAA 和 Totients](https://codeforces.com/problemset/problem/106098/I)

 **评级：** -
 **标签：** -
 **求解时间：** 1m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于每个数字$a_i$, Meda 计算$$f(a_i)=\prod_{p \mid a_i}\left(1-\frac1p\right)$$其中产品运行在不同的素因数上$a_i$。 

我们得到了一个数组，最多可达$2 \cdot 10^5$整数，每个最多$10^6$，并且必须确定有多少个不同的有理值出现在所有计算的值中$f(a_i)$。 

第一个观察结果是指数并不重要。 该值仅取决于哪些素数整除该数字，而不取决于它们整除该数字的次数。 例如，$$f(12)=\left(1-\frac12\right)\left(1-\frac13\right)$$和$$f(36)=\left(1-\frac12\right)\left(1-\frac13\right)$$因为这两个数字都有相同的一组不同的质因数。 

这些约束立即排除了通过试除法对每个数字进行因式分解的可能性$\sqrt{10^6}$。 在最坏的情况下，大约需要$2 \cdot 10^5 \cdot 1000$操作，这在 Python 中已经太大了。 因为所有的值最多都是$10^6$，基于筛子的预处理方法是自然的方向。 

一个微妙的点是两组不同的素因数永远不会产生相同的值$f$。 存储浮点近似值的解决方案可能会失败，因为不同的有理数在舍入后可能变得无法区分。 

考虑一下数字：```
6 10
```他们的价值观是$$f(6)=\frac12\cdot\frac23=\frac13$$和$$f(10)=\frac12\cdot\frac45=\frac25$$这些都是不同的道理。 任何基于低精度浮点运算的方法都有可能合并本应保持不同的值。 

另一个容易犯的错误是通过完全因式分解来区分数字，而不是通过不同的质数集来区分数字。 

例如：```
2 4 8 16
```所有四个数字都有相同的质因数集$\{2\}$，所以每个值都等于$1/2$，答案是1。 

## 方法

 强力解决方案将分解每个数字，显式计算有理值$$\prod_{p \mid n}\left(1-\frac1p\right),$$减少分数，并将其插入集合中。 

这是正确的，因为公式直接定义了值。 瓶颈在于因式分解。 试分割最多$\sqrt{n}$每个号码大约需要 1000 张支票$n$就在附近$10^6$。 和$2 \cdot 10^5$数字，这变成了数亿次操作。 

关键的观察是$$f(n)=\prod_{p\mid n}\frac{p-1}{p}.$$该值仅取决于不同素因数的集合。 

现在是关键的数论事实。 假设两个数有素数集$S_1$和$S_2$。 然后$$\prod_{p\in S_1}\frac{p-1}{p}
=
\prod_{p\in S_2}\frac{p-1}{p}.$$两边同时乘以所有涉及的素数的乘积得到$$\prod_{p\in S_1}(p-1)\prod_{q\in S_2\setminus S_1}q
=
\prod_{p\in S_2}(p-1)\prod_{q\in S_1\setminus S_2}q.$$采取主要$r$恰好属于一个集合，比如说$r\in S_1\setminus S_2$。 右边可以整除$r$，因为它包含因子$r$。 左边不能被整除$r$， 自从$r\nmid (r-1)$和$r\nmid (p-1)$对于出现在那里的所有其他素因数。 矛盾。 

因此，相等的值意味着相同的素数集。 

现在问题就简单多了。 我们只需要计算数组中出现了多少组不同的素因数。 

自从$a_i \le 10^6$，我们可以使用筛子预先计算每个数字的最小质因数。 然后，每个数字可以在对数时间内分解，提取其不同的素因数，并将所得元组插入到集合中。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(n\sqrt A)$|$O(n)$| 太慢了 |
 | 最佳 |$O(A \log\log A + n\log A)$|$O(A)$| 已接受 |

 这里$A = 10^6$。 

## 算法演练

 1. 读取数组并确定其中出现的最大值。 
2. 构建一个达到该最大值的最小素因子筛。 
3. 对于每个数字，重复除以它的最小质因数。 
4. 每当遇到新的素数因子时，将其添加到不同素数的列表中。 
5. 在继续分解之前，跳过所有重复出现的相同质数。 这仅提取不同的素因数集。 
6. 将不同素数的列表转换为元组并将其插入到集合中。 
7. 处理完所有数字后，输出集合的大小。 

步骤 6 起作用的原因是元组唯一标识素除数集，上面的证明表明$f(n)$由该集合唯一确定。 

### 为什么它有效

 对于每个数字$n$，值$f(n)$仅取决于其不同的素因数。 

我们证明了两个不同的素因数集合不能产生相同的值$f$。 因此，值之间存在一一对应关系$f$以及不同质因数的集合。 

该算法准确地存储这些集合。 同一集合的每次出现都会贡献相同的元组，而每个不同的集合都会贡献不同的元组。 不同元组的数量恰好是不同值的数量$f$。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))

mx = max(a)

spf = list(range(mx + 1))
for i in range(2, int(mx ** 0.5) + 1):
    if spf[i] == i:
        for j in range(i * i, mx + 1, i):
            if spf[j] == j:
                spf[j] = i

seen = set()

for x in a:
    primes = []

    while x > 1:
        p = spf[x]
        primes.append(p)

        while x % p == 0:
            x //= p

    seen.add(tuple(primes))

print(len(seen))
```筛子存储每个数字的最小质因数。 这允许每次因式分解一次重复地剥离一个素数。 

内部循环删除同一素数的所有副本。 这是关键的细节，因为该函数仅取决于不同的素因数。 如果不删除重复项，诸如 2 和 4 之类的数字将生成不同的签名，即使它们产生相同的值。 

在 Python 集合中使用元组可以提供质因数集合的紧凑表示。 由于使用 SPF 筛时因式分解自然会按升序发现素数，因此元组表示是规范的并且不需要额外的排序。 

## 工作示例

 ### 示例 1

 输入：```
3
2 3 4
```| 数量 | 不同素数 | 存储的元组 | 设置尺寸|
 | ---| ---| ---| ---|
 | 2 | {2} | (2,) | 1 |
 | 3 | {3} | (3,) | 2 |
 | 4 | {2} | (2,) | 2 |

 回答：`2`。 

这表明相同质数的幂可以折叠为相同的签名。 

### 示例 2

 输入：```
6
3 9 93842 123 2 1024
```| 数量 | 不同素数 | 存储的元组 |
 | ---| ---| ---|
 | 3 | {3} | (3,) |
 | 9 | {3} | (3,) |
 | 93842 | {2, 11, 4261} | (2, 11, 4261) |
 | 123 | 123 {3, 41} | (3, 41) |
 | 2 | {2} | (2,) |
 | 1024 | 1024 {2} | (2,) |

 不同的元组是：$$(3,),\ (2,11,4261),\ (3,41),\ (2,)$$所以答案是`4`。 

这个例子表明，重复的幂不会产生新的值，而不同的素数集总是会产生新的值。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(A \log \log A + n \log A)$| SPF 筛加上所有数字的因式分解 |
 | 空间|$O(A)$| 最小素因子数组 |

 和$A \le 10^6$和$n \le 2 \cdot 10^5$，这很容易符合比赛限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n = int(input())
    a = list(map(int, input().split()))

    mx = max(a)

    spf = list(range(mx + 1))
    for i in range(2, int(mx ** 0.5) + 1):
        if spf[i] == i:
            for j in range(i * i, mx + 1, i):
                if spf[j] == j:
                    spf[j] = i

    seen = set()

    for x in a:
        cur = []
        while x > 1:
            p = spf[x]
            cur.append(p)
            while x % p == 0:
                x //= p
        seen.add(tuple(cur))

    return str(len(seen))

# provided samples
assert run("3\n2 3 4\n") == "2", "sample 1"
assert run("6\n3 9 93842 123 2 1024\n") == "4", "sample 2"

# custom cases
assert run("1\n2\n") == "1", "minimum size"
assert run("4\n2 4 8 16\n") == "1", "same prime set"
assert run("3\n6 10 15\n") == "3", "three different prime sets"
assert run("5\n30 60 90 210 2310\n") == "3", "mixed repeated sets"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 2`|`1`| 最小输入尺寸|
 |`2 4 8 16`|`1`| 同素数幂的崩溃 |
 |`6 10 15`|`3`| 不同的素数集保持不同|
 |`30 60 90 210 2310`|`3`| 重复和扩展素数集 |

 ## 边缘情况

 考虑：```
4
2 4 8 16
```因式分解产生相同的不同质数元组`(2,)`每次。 该集合以一个元素结束，所以答案是`1`。 保留指数的解决方案会错误地计算四个不同的签名。 

考虑：```
2
6 10
```元组是`(2,3)`和`(2,5)`。 两者分别插入，给出答案`2`。 这证实了不同的素数集永远不会合并。 

考虑：```
3
6 12 18
```每个数字都有不同的质因数`{2,3}`。 该算法提取`(2,3)`对于所有三个数字，插入一次，然后输出`1`。 这验证了重复的指数被完全忽略，完全按照定义的要求$f(n)$。
