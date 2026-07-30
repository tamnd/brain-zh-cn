---
title: "CF 102861N - 数字乘法"
description: "有 M 个隐藏节点。 每个隐藏节点都拥有一个未知素数，这些素数按节点索引升序排列。 还有N个可见节点。"
date: "2026-07-25T14:09:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102861
codeforces_index: "N"
codeforces_contest_name: "2020-2021 ACM-ICPC Brazil Subregional Programming Contest"
rating: 0
weight: 102861
solve_time_s: 62
verified: true
draft: false
---

[CF 102861N - 数字乘法](https://codeforces.com/problemset/problem/102861/N)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 有`M`隐藏节点。 每个隐藏节点都拥有一个未知素数，这些素数按节点索引升序排列。 还有`N`可见节点。 可见节点存储与其连接的所有隐藏节点的素数的乘积，其中重复的边意味着重复的乘法。 

输入给出存储在`N`可见节点和完整的连接列表及其多重性。 隐藏节点的原始素数标签消失了，任务是按照隐藏节点索引的升序恢复它们。 

重要的观察是，该图已经告诉我们每个隐藏素数的指数模式。 如果隐藏节点`j`有`d`到可见节点的边`i`，则属于节点的素数`j`与指数一起出现`d`在`c[i]`。 因此每个隐藏节点对应于指数矩阵的一行。 

这些约束指向因式分解而不是试图解决大型代数系统。 有少于`1000`可见值，如下`10^15`，因此使用高效的整数因式分解算法对每个值进行因式分解是实用的。 边数如下`10000`，因此存储的指数模式很小。 尝试素数和节点之间所有可能的分配的解决方案是不可能的，因为排列的数量呈爆炸式增长。 

有几种情况可能会因粗心的实施而被破坏。 如果两个隐藏节点具有完全相同的连接，则它们的指数模式是相同的。 例如：```
2 1 2
15
1 1 1
2 1 1
```输出是：```
3 5
```两个隐藏节点都贡献指数`1`到唯一可见的节点，因此分解给出两个具有相同签名的素数。 假设每个签名都是唯一的解决方案将会失败。 

另一个问题是可见节点可以包含高指数的素数。 例如：```
1 1 1
2
1 1 10
```答案是：```
2
```指数向量包含`10`，所以只计算素数是否出现是不正确的。 必须保留每条边的多重性。 

## 方法

 一种直接的方法是分解给定的乘积，然后尝试将发现的素数分配给隐藏节点。 该分配受到边缘多重性的限制，但是对可能的分配进行强力搜索仍然是巨大的。 和`M`隐藏节点最多可达`M!`可能的映射，对于接近的值来说这已经是不可能的`1000`。 

问题的结构消除了搜索的需要。 当我们分解每个可见值时，我们可以构建每个发现的素数的指数向量。 例如，如果素数显示为```
c1: exponent 2
c2: exponent 0
c3: exponent 5
```那么它的签名是`[2, 0, 5]`。 与多重性相连的隐藏节点`[2, 0, 5]`必须是拥有该素数的节点。 

该图预先为我们提供了每个隐藏节点的签名。 我们只需要将图中的签名与因式分解获得的签名进行匹配。 由于相同的签名可以属于多个素数，因此我们存储每个签名的所有素数，并在按索引顺序处理隐藏节点时消耗它们。 

蛮力之所以有效，是因为指数模式唯一地描述了隐藏节点和可见值之间的关系。 它失败了，因为找到匹配的排列是不必要的工作。 保理直接公开相同的信息。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(M! + 因式分解) | O(M + N) | 太慢了 |
 | 最佳| O(N * F + K + M * N) | O(N * F + K + M * N) | O(N * F + M * N) | 已接受 |`F`是用 Pollard Rho 分解一个数字的成本，对于给定的限制来说它足够小。 

## 算法演练

 1. 构建每个隐藏节点的指数签名。 对于隐藏节点`j`，创建一个长度的数组`N`。 位置处的值`i`是隐藏节点之间的边数`j`和可见节点`i`。 这正是隐藏素数在可见乘积中必须具有的指数模式。 
2. 考虑每个可见的值`c[i]`。 因式分解时，存储每个素数在每个可见节点中出现的次数。 结果是每个发现的素数的指数签名。 
3. 小组通过指数签名发现素数。 字典将签名数组映射到生成它的所有素数。 多个素数可能属于同一组，因为不同的隐藏节点可以具有相同的边缘模式。 
4. 对于索引中的每个隐藏节点`1`到`M`，查找其签名并从匹配组中取出一个未使用的素数。 处理顺序给出了所需的输出顺序。 
5. 打印恢复的素数。 

其工作原理：每个隐藏节点都贡献一个未知素数，可见节点包含的有关该素数的唯一信息是其在每个乘积中的指数。 图中的指数向量和因式分解获得的指数向量描述同一个对象。 因为每个隐藏节点都至少有一条边，所以每个隐藏素数都会出现在某处，并在因式分解过程中被恢复。 匹配相等的签名可重建原始分配。 

## Python 解决方案```python
import sys
import random
from collections import defaultdict

input = sys.stdin.readline

def mul_mod(a, b, mod):
    return (a * b) % mod

def pow_mod(a, n, mod):
    r = 1
    while n:
        if n & 1:
            r = mul_mod(r, a, mod)
        a = mul_mod(a, a, mod)
        n >>= 1
    return r

def is_prime(n):
    if n < 2:
        return False
    small = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
    for p in small:
        if n == p:
            return True
        if n % p == 0:
            return False

    d = n - 1
    s = 0
    while d % 2 == 0:
        s += 1
        d //= 2

    for a in [2, 3, 5, 7, 11, 13]:
        if a >= n:
            continue
        x = pow_mod(a, d, n)
        if x == 1 or x == n - 1:
            continue
        for _ in range(s - 1):
            x = mul_mod(x, x, n)
            if x == n - 1:
                break
        else:
            return False
    return True

def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def pollard_rho(n):
    if n % 2 == 0:
        return 2
    while True:
        c = random.randrange(1, n - 1)
        x = random.randrange(0, n - 1)
        y = x
        d = 1
        while d == 1:
            x = (mul_mod(x, x, n) + c) % n
            y = (mul_mod(y, y, n) + c) % n
            y = (mul_mod(y, y, n) + c) % n
            d = gcd(abs(x - y), n)
        if d != n:
            return d

def factor(n, out):
    if n == 1:
        return
    if is_prime(n):
        out[n] += 1
    else:
        d = pollard_rho(n)
        factor(d, out)
        factor(n // d, out)

def solve():
    M, N, K = map(int, input().split())
    c = list(map(int, input().split()))

    signatures = [[0] * N for _ in range(M)]
    for _ in range(K):
        m, n, d = map(int, input().split())
        signatures[m - 1][n - 1] = d

    prime_vectors = defaultdict(lambda: [0] * N)

    for i, value in enumerate(c):
        fac = defaultdict(int)
        factor(value, fac)
        for p, e in fac.items():
            prime_vectors[p][i] = e

    groups = defaultdict(list)
    for p, vec in prime_vectors.items():
        groups[tuple(vec)].append(p)

    answer = []
    for sig in signatures:
        arr = groups[tuple(sig)]
        answer.append(arr.pop())

    answer.sort()
    print(*answer)

if __name__ == "__main__":
    solve()
```代码的第一部分实现了确定性素性测试和 Pollard Rho 分解，数字高达`10^15`。 试除法会太慢，因为接近极限的素数可能需要检查许多除数。 

主要算法将图形信息存储为指数矩阵的行。 输入边缘重数直接分配给相应的位置，因为该重数正是该隐藏素数的指数贡献。 

在分解过程中，代码将每个发现的素数放入由可见节点索引的向量中。 该向量与图形行具有相同的签名。 组字典处理多个隐藏节点共享相同签名的情况。 

最终查找按隐藏节点顺序完成，然后在打印之前对结果素数进行排序。 排序是安全的，因为该问题保证隐藏节点索引对应于递增的素数标签。 

## 工作示例

 ### 示例 1

 输入：```
4 3 4
15 16 13
2 1 1
3 1 1
1 2 4
4 3 1
```图签名和恢复因子为：

 | 隐藏节点| 签名| 匹配素数|
 | --- | --- | --- |
 | 1 | [0,4,0]| 2 |
 | 2 | [1,0,0]| 3 |
 | 3 | [1,0,0]| 5 |
 | 4 | [0,0,1]| 13 |

 因式分解创建：

 | 可见节点| 因式分解 |
 | --- | --- |
 | 1 | 3 * 5 | 3 * 5
 | 2 | 2^4 | 2^4
 | 3 | 13 |

 这证实了相等的签名可以映射到多个素数。 

### 示例 2

 输入：```
4 5 7
3 9 7 143 143
1 1 1
1 2 2
2 3 1
3 4 1
3 5 1
4 5 1
4 4 1
```匹配时的状态为：

 | 隐藏节点| 签名| 剩余匹配素数 | 选择|
 | --- | --- | --- | --- |
 | 1 | [1,2,0,0,0] | [3] | 3 |
 | 2 | [0,0,1,0,0] | [7] | 7 |
 | 3 | [0,0,0,1,1] | [11] | 11 | 11
 | 4 | [0,0,0,1,1] | [13]| 13 |

 最后两个隐藏节点具有相同的图行为，并且分解还产生具有相同签名的两个素数。 分组步骤可以让两者都得到恢复。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N * F + K + M * N) | O(N * F + K + M * N) | 每个产品被分解一次，边缘被读取一次，并通过散列来比较签名。 |
 | 空间| O(N * P + M * N) |`P`是乘积中出现的不同素数的数量。 |

 不同素数的数量不能超过隐藏节点的数量，因为每个因子都属于一个隐藏节点标签。 这些限制使得存储指数矩阵和因子签名变得可行。 

## 测试用例```python
import sys
import io

# This helper assumes solve() from the solution is available.
def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    solve()
    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return out.getvalue().strip()

assert run("""4 3 4
15 16 13
2 1 1
3 1 1
1 2 4
4 3 1
""") == "2 3 5 13"

assert run("""4 5 7
3 9 7 143 143
1 1 1
1 2 2
2 3 1
3 4 1
3 5 1
4 5 1
4 4 1
""") == "3 7 11 13"

assert run("""1 1 1
2
1 1 1
""") == "2"

assert run("""2 1 2
15
1 1 1
2 1 1
""") in ["3 5", "5 3"]

assert run("""3 3 3
4 9 25
1 1 2
2 2 2
3 3 2
""") == "2 3 5"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 具有一条边的单节点 |`2`| 最小图形尺寸|
 | 两个相同的签名 |`3 5`| 重复的指数模式 |
 | 独立平方因子|`2 3 5`| 大指数 |
 | 样品| 给定输出 | 标准行为 |

 ## 边缘情况

 重复签名案例：```
2 1 2
15
1 1 1
2 1 1
```因式分解后，唯一可见的值变成`3 * 5`。 两个素数都有签名`[1]`，并且两个隐藏节点也都有签名`[1]`。 该算法将两个素数存储在同一组中，并为每个隐藏节点删除一个素数，从而生成正确的对。 

高指数情况：```
1 1 1
2
1 1 10
```图签名是`[10]`。 因式分解产生素数`2`与指数向量`[10]`，所以匹配成功。 只记录素数是否存在的方法会错误地创建签名`[1]`并失败。 

具有单个连接的隐藏节点也可以自然处理。 例如：```
1 2 1
6 7
1 2 1
```签名是`[0,1]`，因式分解给出素数`7`具有相同的向量。 未使用的因素`2`不存在，因为每个隐藏节点都必须出现在图中，因此恢复的答案保持一致。
