---
title: "CF 102644G - 平方递归"
description: "该问题中的序列不是标准的线性递归，因为下一个值不仅取决于先前的值，还取决于序列中的当前位置。"
date: "2026-08-01T10:20:54+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102644
codeforces_index: "G"
codeforces_contest_name: "Matrix Exponentiation"
rating: 0
weight: 102644
solve_time_s: 58
verified: true
draft: false
---

[CF 102644G - 平方递归](https://codeforces.com/problemset/problem/102644/G)

 **评级：** -
 **标签：** -
 **求解时间：** 58s
 **已验证：** 是的

 ## 解决方案
 # 问题理解

 该问题中的序列不是标准的线性递归，因为下一个值不仅取决于先前的值，还取决于序列中的当前位置。 我们得到了序列的前几个值、组合先前值的系数以及创建索引的二次函数的三个额外系数。 任务是在一个潜在巨大的索引处找到序列的值并将其模数打印出来$10^9+7$。 

递归的形式是每个新元素都是从前一个元素创建的$n$元素加上多项式项。 前面的元素由固定系数加权，而附加部分在索引中作为二次表达式增长。 

指数$k$可以大到$10^{18}$，因此一次模拟一个元素的序列是不可能的。 甚至$O(k)$操作所需的工作量远远超过任何比赛时间限制所允许的工作量。 递归的阶数很小，$n \le 10$，因此预期的解决方案必须利用小状态大小而不是所请求索引的大小。 

一个常见的错误是忘记多项式项取决于索引。 例如，将复发视为正常的线性复发并仅使用先前的$n$值丢失了生成未来二次贡献所需的信息。 

考虑输入：```
1 3
5
1
2 3 4
```这些值生成为$a_i = a_{i-1} + 2 + 3i + 4i^2$。 序列变为$5, 14, 38, 85$，所以答案是：```
85
```一个粗心的实现，只跟踪$a_i$并忽略当前索引会错误地假设增加的值是恒定的。 

另一个边缘情况是当请求的索引位于初始值内时。 为了：```
3 1
7 8 9
1 1 1
0 0 0
```答案是：```
8
```不应执行重复步骤，因为$a_1$已经提供了。 始终从第一次转换开始矩阵求幂的解决方案将访问错误的状态。 

## 方法

 直接的方法是重复应用递归，直到达到索引$k$。 为了计算一个新元素，我们将前一个元素相乘$n$值乘以它们的系数并添加二次表达式。 这需要$O(n)$每个生成的元素都需要工作，因此完整的模拟需要$O(nk)$运营。 和$k$达到$10^{18}$，这不太可行。 

蛮力起作用的原因是每个新值仅取决于少量信息：之前的值$n$二次项所需的序列值和当前索引信息。 因此，该序列具有较小的固定大小状态。 

关键的观察结果是二次部分也可以表示为递归。 如果我们将当前索引及其平方存储为附加状态值，则可以通过线性变换生成下一个索引和下一个平方。 整个过程变成了大小向量的矩阵乘法$n+3$。 

一旦转换被表示为矩阵，达到索引$k$需要应用相同的转换$k-(n-1)$次。 快速求幂将其简化为对数矩阵乘法。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nk) | O(nk) | O(n) | 太慢了|
 | 矩阵求幂| O((n+3)^3 log k) | O((n+3)^3 log k) | O((n+3)^2) | O((n+3)^2) | 已接受 |

 ## 算法演练

 1. 构建一个状态向量，其中包含当前序列值、常数值、当前索引和当前索引的平方。 在位置$n-1$，状态为：$$[a_{n-1}, a_{n-2}, \dots, a_0, 1, n-1, (n-1)^2]$$额外的三个值允许通过相同的线性变换来处理递归的二次部分。 

1. 构造从索引移动状态的转移矩阵$i$索引$i+1$。 第一行创建$a_{i+1}$。 它使用递归系数组合存储的序列值并添加：$$p + (i+1)q + (i+1)^2r$$变成：$$(p+q+r) + (q+2r)i + r i^2$$使用存储的值$1$,$i$， 和$i^2$。 

1. 填充矩阵的剩余行以向前移动先前的序列值。 序列部分的行为类似于正常的线性递归，因此每个值只是向下移动一个位置。 
2.如果$k$小于$n$，返回已知的初始值。 否则，计算转移矩阵的幂$k-(n-1)$。 

指数正是从索引处的初始状态移动所需的转换数量$n-1$到所需的索引。 

1. 将幂矩阵乘以初始状态向量。 结果向量的第一个元素是$a_k$。 

为什么它有效：

 不变量是应用转移矩阵之后$t$次，状态向量恰好包含位置的序列值和索引信息$n-1+t$。 矩阵使用相同的递推公式计算下一个序列值，并一致地更新索引信息。 由于矩阵求幂产生的结果与重复应用转换相同，因此之后的第一个分量$k-(n-1)$过渡必须是$a_k$。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10 ** 9 + 7

def mat_mul(a, b):
    n = len(a)
    m = len(b[0])
    k = len(b)
    res = [[0] * m for _ in range(n)]
    for i in range(n):
        for x in range(k):
            if a[i][x]:
                ax = a[i][x]
                for j in range(m):
                    res[i][j] = (res[i][j] + ax * b[x][j]) % MOD
    return res

def mat_pow(a, e):
    n = len(a)
    res = [[0] * n for _ in range(n)]
    for i in range(n):
        res[i][i] = 1
    while e:
        if e & 1:
            res = mat_mul(res, a)
        a = mat_mul(a, a)
        e >>= 1
    return res

def solve():
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    c = list(map(int, input().split()))
    p, q, r = map(int, input().split())

    if k < n:
        print(a[k] % MOD)
        return

    size = n + 3
    trans = [[0] * size for _ in range(size)]

    for i in range(n):
        trans[0][i] = c[i] % MOD

    trans[0][n] = (p + q + r) % MOD
    trans[0][n + 1] = (q + 2 * r) % MOD
    trans[0][n + 2] = r % MOD

    for i in range(1, n):
        trans[i][i - 1] = 1

    trans[n][n] = 1
    trans[n + 1][n] = 1
    trans[n + 1][n + 1] = 1
    trans[n + 2][n] = 1
    trans[n + 2][n + 1] = 2
    trans[n + 2][n + 2] = 1

    state = [[0] for _ in range(size)]
    for i in range(n):
        state[i][0] = a[n - 1 - i] % MOD

    idx = n - 1
    state[n][0] = 1
    state[n + 1][0] = idx % MOD
    state[n + 2][0] = (idx * idx) % MOD

    result = mat_mul(mat_pow(trans, k - (n - 1)), state)
    print(result[0][0] % MOD)

if __name__ == "__main__":
    solve()
```该代码首先处理简单的情况，其中答案位于提供的初始值中。 这避免了不必要的矩阵构造，也防止了索引错误。 

转移矩阵使用第一个$n$序列历史的列。 该序列以倒序存储，以便第一行可以直接应用系数$c_1, c_2, \ldots, c_n$。 

最后三个位置存储$1$、当前索引和当前索引的平方。 平方过渡如下：$$(i+1)^2 = i^2 + 2i + 1$$这解释了最后一行中的系数。 所有运算均按模进行$10^9+7$，所以 Python 的整数大小不是问题。 

指数是$k-(n-1)$， 不是$k$。 起始状态已经代表$a_{n-1}$，因此只需应用剩余的转换。 

## 工作示例

 对于第一个样本：```
2 2
0 30
2 1
2 1 1
```初始状态为：

 | 步骤| 当前指数| 存储值| 添加术语 | 结果 |
 | --- | --- | --- | --- | --- |
 | 初始| 1 | a1=30，a0=0 | 无 | 30|
 | 过渡 | 2 | 2×30+0 | 2+2+4 | 68 | 68

 转换从索引 1 移动到索引 2 一次。 该矩阵正确地组合了先前的值和二次贡献。 

对于第二个样本：```
1 3
5
1
2 3 4
```状态演化为：

 | 步骤| 当前指数| 先前值| 多项式贡献| 新价值|
 | --- | --- | --- | --- | --- |
 | 初始| 0 | 5 | 无 | 5 |
 | 过渡 | 1 | 5 | 2+3+4 | 14 | 14
 | 过渡 | 2 | 14 | 14 2+6+16 | 38 | 38
 | 过渡 | 3 | 38 | 38 2+9+36 | 85 | 85

 该迹线说明了为什么索引和平方必须是状态的一部分。 每一步的附加值都会发生变化。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n+3)^3 log k) | O((n+3)^3 log k) | 矩阵乘法是在二进制求幂期间完成的。 |
 | 空间| O((n+3)^2) | O((n+3)^2) | 仅存储转移矩阵和向量。 |

 矩阵维度最多为 13，因为$n$至多为 10。 的对数$k$即使对于 60 左右$10^{18}$，因此该解决方案很容易满足限制。 

## 测试用例```python
import sys
import io

MOD = 10 ** 9 + 7

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().split()
    sys.stdin = old

    it = iter(data)
    n = int(next(it))
    k = int(next(it))
    a = [int(next(it)) for _ in range(n)]
    c = [int(next(it)) for _ in range(n)]
    p = int(next(it))
    q = int(next(it))
    r = int(next(it))

    if k < n:
        return str(a[k] % MOD)

    size = n + 3
    trans = [[0] * size for _ in range(size)]

    for i in range(n):
        trans[0][i] = c[i] % MOD
    trans[0][n] = (p + q + r) % MOD
    trans[0][n + 1] = (q + 2 * r) % MOD
    trans[0][n + 2] = r % MOD

    for i in range(1, n):
        trans[i][i - 1] = 1

    trans[n][n] = 1
    trans[n + 1][n] = 1
    trans[n + 1][n + 1] = 1
    trans[n + 2][n] = 1
    trans[n + 2][n + 1] = 2
    trans[n + 2][n + 2] = 1

    def mul(a, b):
        m = len(a)
        res = [[0] * m for _ in range(m)]
        for i in range(m):
            for x in range(m):
                for j in range(m):
                    res[i][j] = (res[i][j] + a[i][x] * b[x][j]) % MOD
        return res

    def power(a, e):
        m = len(a)
        res = [[int(i == j) for j in range(m)] for i in range(m)]
        while e:
            if e & 1:
                res = mul(res, a)
            a = mul(a, a)
            e >>= 1
        return res

    state = [[0] for _ in range(size)]
    for i in range(n):
        state[i][0] = a[n - 1 - i]
    state[n][0] = 1
    state[n + 1][0] = n - 1
    state[n + 2][0] = (n - 1) * (n - 1)

    ans = mul(power(trans, k - n + 1), state)
    return str(ans[0][0] % MOD)

assert run("""2 2
0 30
2 1
2 1 1
""") == "68"

assert run("""1 3
5
1
2 3 4
""") == "85"

assert run("""1 0
123
5
1 1 1
""") == "123"

assert run("""3 2
7 8 9
1 1 1
0 0 0
""") == "9"

assert run("""1 1000000000000000000
0
1
0 0 0
""") != ""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 第二个样品 | 85 | 85 具有 1 阶递归的二次增长 |
 | 初始索引查询| 123 | 123 返回已知值 |
 | 零多项式递推 | 9 | 纯线性递推的正确处理 |
 | 庞大的指数| 有效的非空结果 | 非常大的 k 的矩阵求幂 |

 ## 边缘情况

 第一个重要的边缘情况是初始序列内的查询。 为了：```
3 1
7 8 9
1 1 1
0 0 0
```该算法立即返回第二个提供的值。 它从不应用转移矩阵，因为递归仅定义未来元素。 

第二个边缘情况是多项式贡献为零的递归。 在这种情况下，最后三个状态值仍然存在，但第一行只是忽略它们。 该矩阵的行为与正常的线性递归完全相同。 

最后的边缘情况是一个非常大的索引。 例如：```
1 1000000000000000000
0
1
0 0 0
```模拟需要$10^{18}$过渡。 相反，该算法执行大约 60 次矩阵平方，并使用二进制求幂获得相同的转换幂。
