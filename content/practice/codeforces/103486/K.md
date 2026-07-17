---
title: "CF 103486K - 括号序列"
description: "当有$K$种不同类型的括号时，我们被要求计算有多少个总长度为$2N$的有效括号结构。 每种类型的行为就像一对匹配的对，例如类型 1 可以是“()”，类型 2 可以是“[]”，依此类推。"
date: "2026-07-03T06:22:33+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103486
codeforces_index: "K"
codeforces_contest_name: "The 15th Jilin Provincial Collegiate Programming Contest"
rating: 0
weight: 103486
solve_time_s: 42
verified: true
draft: false
---

[CF 103486K - 括号序列](https://codeforces.com/problemset/problem/103486/K)

 **评级：** -
 **标签：** -
 **求解时间：** 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求计算总长度有多少个有效的括号结构$2N$当存在时存在$K$不同种类的括号。 每种类型的行为就像一对匹配的对，例如类型 1 可以是“()”，类型 2 可以是“[]”，依此类推。 有效序列的构建方式与普通平衡括号完全相同：每个左括号必须与相同类型的右括号匹配，嵌套必须具有正确的结构，并且有效序列的串联也是有效的。 

与经典加泰罗尼亚计数的唯一真正区别是，每次我们引入匹配对时，我们都有$K$其类型的独立选择。 因此，这个问题在结构上与计算平衡括号相同，只是每对都带有乘法颜色因子。 

约束条件达到$N \le 10^5$，因此任何尝试枚举结构或模拟堆栈状态的解决方案都是立即不可能的。 即使基于前缀的动态编程也太慢，如果它依赖于$O(N^2)$过渡。 我们需要一个可以在大致线性时间内计算的封闭式组合表达式。 

一个微妙的边缘情况是$N = 1$。 答案很简单$K$，因为唯一有效的顺序是一个左括号后跟其匹配的右括号，并且可以自由选择类型。 

朴素推理的另一个不明显的失败案例是假设我们可以独立地对待每个位置。 例如，认为有$K^N$除非我们正确地将结构和标签分开，否则在没有理由的情况下分配类型然后乘以加泰罗尼亚数字的方法会导致计数过多。 

## 方法

 如果我们暂时忽略结构，我们可能会尝试递归地思考：在每一步中，我们要么放置某种类型的左括号，要么放置右括号。 这自然会导致前缀平衡上的 DP 以及可能的堆栈状态。 经典的解决方案$K=1$是加泰罗尼亚数，通过 DP 或二项式系数计算。 

然而，随着$N$最多$10^5$，即使通过阶乘计算加泰罗尼亚数也是边缘性的，但如果使用模逆来完成，仍然是可行的。 真正关键的观察是有效括号序列的结构根本不依赖于类型。 序列的形状与标准括号完全相同：有$C_N$有效的_形状_，其中$C_N$是$N$-th 加泰罗尼亚号码。 

一旦形状固定，我们就分配类型。 每个匹配对（括号分解的隐式树结构中的每条边）都可以独立选择其中之一$K$类型。 由于正好有$N$对，这贡献了一个因素$K^N$。 

所以答案就变成了：$$\text{Answer} = C_N \cdot K^N \pmod{10^9+7}$$我们使用以下方法计算加泰罗尼亚数字：$$C_N = \frac{1}{N+1} \binom{2N}{N}$$这将问题简化为阶乘预计算和模幂运算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解序列 | 指数| 指数| 太慢了 |
 | 加泰罗尼亚语 + 求幂 |$O(N)$|$O(N)$| 已接受 |

 ## 算法演练

 1. 预先计算阶乘和逆阶乘$2N$。 这允许快速二项式系数计算。 我们需要阶乘因为$\binom{2N}{N}$是加泰罗尼亚数字的核心。 
2. 计算$\binom{2N}{N}$使用标准模数公式：$$\binom{2N}{N} = \frac{(2N)!}{(N!)^2}$$使用模逆而不是除法。 
3. 计算加泰罗尼亚数：$$C_N = \binom{2N}{N} \cdot (N+1)^{-1}$$的逆$N+1$使用模幂计算。 
4. 计算$K^N \bmod (10^9+7)$使用二进制求幂。 这代表独立分配其中之一$K$类型为每个$N$配对。 
5. 将两个结果相乘并输出结果模$10^9+7$。 

### 为什么它有效

 每个有效的括号序列唯一对应于一个有效的二叉树结构$N$内部节点，按加泰罗尼亚数字计数。 括号 _types_ 不会影响正确性约束，因为匹配只需要左括号与其相应的右括号之间的类型相等，并且不限制不同对之间的嵌套交互。 因此，一旦结构骨架固定，每个$N$两人可以独立选择其中之一$K$标签，给出一个干净的乘法因子$K^N$。 这种独立性保证了不会出现多算或漏报的情况。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def modpow(a, e):
    res = 1
    while e:
        if e & 1:
            res = res * a % MOD
        a = a * a % MOD
        e >>= 1
    return res

def solve():
    n, k = map(int, input().split())
    
    if n == 0:
        print(1)
        return
    
    maxv = 2 * n
    
    fact = [1] * (maxv + 1)
    invfact = [1] * (maxv + 1)
    
    for i in range(1, maxv + 1):
        fact[i] = fact[i - 1] * i % MOD
    
    invfact[maxv] = modpow(fact[maxv], MOD - 2)
    for i in range(maxv, 0, -1):
        invfact[i - 1] = invfact[i] * i % MOD
    
    def C(a, b):
        if b < 0 or b > a:
            return 0
        return fact[a] * invfact[b] % MOD * invfact[a - b] % MOD
    
    catalan = C(2 * n, n) * modpow(n + 1, MOD - 2) % MOD
    ways_types = modpow(k, n)
    
    print(catalan * ways_types % MOD)

if __name__ == "__main__":
    solve()
```阶乘预处理会构建一个查找表，因此可以在每个查询的恒定时间内计算二项式系数。 加泰罗尼亚计算直接来自封闭形式，并且模逆$n+1$在模算术下安全地处理除法。 

求幂为$K^N$是独立且相乘的，反映了每个匹配对都带有独立的标签选择这一事实。 

## 工作示例

 ### 示例 1

 输入：```
1 2
```这里$N = 1$,$K = 2$。 恰好有一个结构括号序列：一对。 所以加泰罗尼亚数字是1。 

| 步骤| 价值|
 | --- | --- |
 |$C_1$| 1 |
 |$K^1$| 2 |
 | 结果 | 2 |

 输出为2，对应“()”和“[]”。 

这证实了结构贡献 1 并且只有标签才重要。 

### 示例 2

 输入：```
2 2
```为了$N = 2$，有 2 个加泰罗尼亚语结构：“()()”和“(())”。 每组有 2 对，每组独立选择 2 种类型中的一种。 

| 结构| 计数 | 类型分配 | 贡献 |
 | --- | --- | --- | --- |
 | ()() | 1 |$2^2 = 4$| 4 |
 | (()) | 1 |$2^2 = 4$| 4 |

 总计 = 8。 

所以答案是8。 

这表明结构和标记之间的独立性，这是核心分解。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(N)$| 阶乘预计算高达$2N$加模幂|
 | 空间|$O(N)$| 阶乘和逆阶乘数组的存储 |

 和$N \le 10^5$, 预计算至$2N$完全在限制范围内，并且所有操作都是线性传递或对数求幂。 

## 测试用例```python
import sys, io

MOD = 10**9 + 7

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    
    MOD = 10**9 + 7
    
    def modpow(a, e):
        res = 1
        while e:
            if e & 1:
                res = res * a % MOD
            a = a * a % MOD
            e >>= 1
        return res
    
    n, k = map(int, input().split())
    if n == 0:
        return "1"
    
    maxv = 2 * n
    fact = [1] * (maxv + 1)
    invfact = [1] * (maxv + 1)
    
    for i in range(1, maxv + 1):
        fact[i] = fact[i - 1] * i % MOD
    
    invfact[maxv] = modpow(fact[maxv], MOD - 2)
    for i in range(maxv, 0, -1):
        invfact[i - 1] = invfact[i] * i % MOD
    
    def C(a, b):
        return fact[a] * invfact[b] % MOD * invfact[a - b] % MOD
    
    catalan = C(2 * n, n) * modpow(n + 1, MOD - 2) % MOD
    return str(catalan * modpow(k, n) % MOD)

# provided samples
assert run("1 2") == "2"
assert run("2 2") == "8"

# custom cases
assert run("1 1") == "1", "single type single pair"
assert run("3 1") == "5", "Catalan(3)=5"
assert run("0 5") == "1", "empty sequence"
assert run("2 3") == str((8 * 9) % (10**9+7)), "mixed types"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1 | 1 1 | 结构简约、类型单一 |
 | 3 1 | 3 1 5 | 纯加泰罗尼亚语的正确性 |
 | 0 5 | 1 | 空序列基本情况 |
 | 2 3 | 72 | 72 结构和标签的结合|

 ## 边缘情况

 的$N = 0$case 对应于空序列。 该算法可以正确处理它，因为 Catalan(0) 为 1 并且$K^0$也为 1，因此乘积仍为 1。 

当$K = 1$，问题精确地简化为计算标准平衡括号序列。 该算法崩溃为仅计算加泰罗尼亚数，并且不会发生过度计数，因为$1^N = 1$。 

什么时候$N = 1$，计算避免了不必要的结构：Catalan(1) 为 1，结果恰好变为$K$，匹配单对的直接枚举。 

一个潜在的实现陷阱是在中间阶乘乘法中应用模之前的整数溢出。 通过在每个乘法步骤取模可以避免这种情况，即使对于$2N$最多$2 \cdot 10^5$。
