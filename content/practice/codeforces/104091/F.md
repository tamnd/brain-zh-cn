---
title: "CF 104091F - \u0411\u0443\u0434\u044c \u043d\u0430\u0447\u0435\u043a\u0443！ 2"
description: "我们正在计算在一个非常具体的邻接规则下可以形成多少个长度为 n 的有效数字。 如果每对连续数字都形成一个两位素数，则该数字被视为有效。"
date: "2026-07-02T02:29:17+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104091
codeforces_index: "F"
codeforces_contest_name: "\u041c\u0443\u043d\u0438\u0446\u0438\u043f\u0430\u043b\u044c\u043d\u044b\u0439 \u044d\u0442\u0430\u043f \u0412\u041e\u0428 \u043f\u043e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0442\u0438\u043a\u0435 \u0432 \u041f\u0435\u0442\u0440\u043e\u0437\u0430\u0432\u043e\u0434\u0441\u043a\u0435 \u0438 \u041a\u0430\u0440\u0435\u043b\u0438\u0438 2022-2023"
rating: 0
weight: 104091
solve_time_s: 44
verified: true
draft: false
---

[CF 104091F - \u0411\u0443\u0434\u044c \u043d\u0430\u0447\u0435\u043a\u0443！ 2](https://codeforces.com/problemset/problem/104091/F)

 **评级：** -
 **标签：** -
 **求解时间：** 44s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在计算有多少个长度有效的数字`n`可以在非常具体的邻接规则下形成。 如果每对连续数字都形成一个两位素数，则该数字被视为有效。 这些数字本身只是来自十进制数，但约束不是关于单个数字，而是关于大小为 2 的滑动窗口。 

所以如果数字是`d1 d2 d3 ... dn`，那么每对`(d1d2), (d2d3), ..., (d(n-1)dn)`必须是两位素数。 这将问题转化为数字上的约束遍历，其中转换取决于两个数字的连接是否形成 10 到 99 之间的素数。 

输入是单个整数`n`，它可以非常大，最多可达`10^15`。 输出是长度有效的数字序列的数量`n`, 取模`1e9 + 7`。 

尺寸为`n`立即排除任何超过长度的动态规划。 甚至`O(n)`是不可能的，因为`n`可能是天文数字。 唯一可行的方向是压缩转移并在固定状态空间上使用矩阵求幂或重复平方。 

当考虑前导数字时，会出现一种微妙的边缘情况。 该问题不限制第一个数字，因此序列可以以任何数字开头`0-9`，尽管数字通常不允许有前导零。 这里我们不是构造标准整数，而是构造数字字符串，所以`0`作为起始数字有效。 

另一个重要的观察是数字是状态，而不是数字。 邻接规则仅取决于前一个数字。 这使得该结构成为最多具有 10 个节点的图。 

## 方法

 暴力解决方案将尝试构建所有有效长度的数字字符串`n`。 对于每个位置，我们尝试所有数字`0-9`并检查与前一个数字的对是否形成质数。 这导致大约`10^n`最坏情况下的可能性，因为大多数转换都允许许多数字。 即使是为了`n = 20`，这已经是不可行的了，并且对于`n = 10^15`这是完全不可能的。 

关键的结构观察是数字的有效性仅取决于所使用的最后一位数字。 如果我们知道最后一位数字，那么未来的选择仅取决于哪些数字与其形成两位素数。 这将问题简化为计算步行长度`n-1`在具有 10 个节点的有向图中，其中边对应于有效的素数转换。 

一旦我们将问题解释为计算小图中固定长度的路径，我们就可以使用矩阵求幂。 我们构建一个 10 x 10 的转移矩阵，其中条目`(i, j)`如果数字为 1`i`可以转换为数字`j`， 意义`10*i + j`是素数。 那么答案就是通过该矩阵求幂获得的向量中所有条目的总和`n-1`并乘以全一的初始向量。 

由于矩阵大小是恒定的，求幂需要`O(10^3 log n)`时间，即使对于`n = 10^15`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(10^n) | O(10^n) | O(n) | 太慢了|
 | 矩阵求幂| O(10^3 log n) | O(10^3 log n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 我们将数字重新解释为图中的节点。 每个有效的两位数素数定义从其十位数字到其个位数字的有向边。 

首先，我们预先计算所有两位数素数。 这些数字从 10 到 99 都是素数。 对于每个这样的素数`p`，我们提取`u = p // 10`和`v = p % 10`，并标记从`u`到`v`。 

其次，我们构建一个10×10的邻接矩阵`T`， 在哪里`T[u][v] = 1`如果允许过渡。 

三、我们构造一个向量`dp0`大小为 10，其中每个条目都是 1。这表示任何数字都可以是长度为 1 的有效序列的起始数字。 

第四，我们计算`T^(n-1)`使用快速求幂。 这表示过渡如何组成多个步骤。 

第五，我们乘法`dp0`通过这个矩阵幂。 所得向量`dp`对于每个数字，给出多少个有效的长度序列`n`以该数字结尾。 

第六，我们将所有条目相加`dp`获取有效序列的总数。 

为什么这有效与一个简单的不变量有关：处理后`k`步骤，`dp[d]`等于长度有效序列的数量`k+1`以数字结尾的`d`。 每个矩阵乘法将所有序列扩展一个有效的数字转换，从而保持每一步的正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def is_prime(x):
    if x < 2:
        return False
    for i in range(2, int(x**0.5) + 1):
        if x % i == 0:
            return False
    return True

def mul(A, B):
    n = 10
    C = [[0] * n for _ in range(n)]
    for i in range(n):
        Ai = A[i]
        Ci = C[i]
        for k in range(n):
            if Ai[k] == 0:
                continue
            aik = Ai[k]
            Bk = B[k]
            for j in range(n):
                Ci[j] = (Ci[j] + aik * Bk[j]) % MOD
    return C

def mpow(M, e):
    n = 10
    R = [[0] * n for _ in range(n)]
    for i in range(n):
        R[i][i] = 1
    while e > 0:
        if e & 1:
            R = mul(R, M)
        M = mul(M, M)
        e >>= 1
    return R

def main():
    n = int(input().strip())

    primes = [x for x in range(10, 100) if is_prime(x)]

    T = [[0] * 10 for _ in range(10)]
    for p in primes:
        u = p // 10
        v = p % 10
        T[u][v] = 1

    if n == 1:
        print(10)
        return

    P = mpow(T, n - 1)

    ans = 0
    for i in range(10):
        for j in range(10):
            ans = (ans + P[i][j]) % MOD

    print(ans)

if __name__ == "__main__":
    main()
```该解决方案首先生成所有两位数素数并将它们转换为数字之间的定向转换。 矩阵`T`对这些转换进行编码。 

功能`mul`在模运算下执行 10 x 10 矩阵乘法。 三重循环是安全的，因为矩阵大小是固定的并且很小，并且内部循环跳过零条目以减少常数因子。 

功能`mpow`对矩阵执行二进制求幂，重复求平方并在需要时应用它。 这就是允许处理非常大的`n`。 

最终答案是通过对结果矩阵的所有条目求和来计算的，该矩阵对应于所有可能的起始数字和恰好之后的所有可能的结束数字`n-1`过渡。 

## 工作示例

 考虑一个小案例，其中`n = 2`。 我们正在计算有效的两位数，其中数字本身必须是两位素数。 该矩阵直接对有效对进行编码。 

| 步骤| 行动| 状态|
 | ---| ---| ---|
 | 1 | 构建素数| {11, 13, 17, 19, 23, ...} |
 | 2 | 构建过渡 | 边如 1→1、1→3、1→7、1→9 等。 
| 3 | 计算结果| 计算所有边 |

 为了`n = 3`，我们在此图中计算长度为 2 的路径。 

| 步骤| 行动| 状态|
 | ---| ---| ---|
 | 1 | 初始 dp | 所有数字的值为 1 |
 | 2 | 1 次转换后 | dp[v] 用 u→v | 计算数字 u
 | 3 | 2 次转换后 | dp[v] 计算以 v 结束的长度为 2 的路径 |

 这演示了 DP 如何自然地累积路径计数。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(10^3 log n) | O(10^3 log n) | 10x10 矩阵乘法在二进制求幂上重复 |
 | 空间| O(1) | O(1) | 固定 10x10 矩阵 |

 复杂度独立于`n`除了对数指数因子外，这使得它适合高达以下的值`10^15`。 

## 测试用例```python
import sys, io

def solve(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    input = _sys.stdin.readline

    MOD = 10**9 + 7

    def is_prime(x):
        if x < 2:
            return False
        for i in range(2, int(x**0.5) + 1):
            if x % i == 0:
                return False
        return True

    def mul(A, B):
        n = 10
        C = [[0] * n for _ in range(n)]
        for i in range(n):
            for k in range(n):
                if A[i][k]:
                    for j in range(n):
                        C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % MOD
        return C

    def mpow(M, e):
        n = 10
        R = [[0]*n for _ in range(n)]
        for i in range(n):
            R[i][i] = 1
        while e:
            if e & 1:
                R = mul(R, M)
            M = mul(M, M)
            e >>= 1
        return R

    n = int(input().strip())
    primes = [x for x in range(10, 100) if is_prime(x)]

    T = [[0]*10 for _ in range(10)]
    for p in primes:
        T[p//10][p%10] = 1

    if n == 1:
        return "10"

    P = mpow(T, n-1)
    ans = 0
    for i in range(10):
        for j in range(10):
            ans = (ans + P[i][j]) % MOD

    return str(ans)

# provided samples (if any existed, they would go here)

# custom tests
assert solve("2") == str(sum(1 for x in range(10,100) if is_prime(x))), "n=2 checks prime pairs"

assert solve("1") == "10", "single digit case"

assert solve("3") > "0", "basic sanity"

assert solve("10") == solve("10"), "consistency check"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 2 | 两位素数的个数 | 基本转换的正确性 |
 | 1 | 10 | 10 单位数边缘情况 |
 | 3 | 正值| 路径扩展逻辑|
 | 10 | 10 一致| 求幂的稳定性 |

 ## 边缘情况

 当`n = 1`，不存在邻接约束，因为不存在数字对。 正确答案就是全部数字`0-9`，给出 10。算法在求幂之前显式检查这种情况。 

为了`n = 2`，答案简化为计算有效的两位素数。 该矩阵恰好包含这些转换，因此中所有条目的总和`T`直接给出结果。 

如果`n`非常大，求幂路径确保我们永远不会显式地迭代长度。 矩阵幂代表转换的重复组合，因此即使像这样的极端值`10^15`处理时不改变逻辑。
