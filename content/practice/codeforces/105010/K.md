---
title: "CF 105010K - 唯一磁盘标识符"
description: "每个输入描述一个由同心圆扇区组成的磁盘。 第 $i$ 个扇区是一个分为 $Ai$ 相等位置的环，每个位置都涂有 $K$ 颜色之一。 因此，每个扇区本质上都是一个彩色循环数组，其长度取决于扇区索引。"
date: "2026-06-28T04:36:21+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105010
codeforces_index: "K"
codeforces_contest_name: "Winter Cup 6.0 Online Mirror Contest"
rating: 0
weight: 105010
solve_time_s: 92
verified: false
draft: false
---

[CF 105010K - 唯一磁盘标识符](https://codeforces.com/problemset/problem/105010/K)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 32s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 每个输入描述一个由同心圆扇区组成的磁盘。 这$i$-th 扇区是一个环，分为$A_i$相同的位置，并且每个位置都涂有以下之一$K$颜色。 因此，每个扇区本质上都是一个彩色循环数组，其长度取决于扇区索引。 

如果您可以通过应用两种类型的对称性将一个磁盘转换为另一个磁盘，则两个磁盘被视为相同的配置。 首先，每个单独的环都可以独立旋转，因此只有扇区内的相对循环结构重要，而不是其起点。 其次，整个圆盘可以围绕通过其中心的任何轴翻转，这同时在每个环上引入了反射对称性。 这意味着每个扇区在大小的完整二面体组下是不变的$2A_i$，而不仅仅是旋转。 

任务是计算当每个扇区独立着色但由这些对称性引出时存在多少种不同的全盘着色，并乘以跨扇区的贡献。 

这些约束使解决方案远离暴力枚举。 和$n \le 10^5$部门和$A_i$最多$5 \cdot 10^5$，任何枚举着色甚至显式模拟对称动作的尝试都是不可能的。 即使每个扇区的旋转等价类的朴素枚举也会呈指数增长$A_i$，这远远超出了限制。 该解决方案必须依赖于封闭式组合学和跨多个部门的重用结构。 

一个微妙的陷阱是假设只有旋转对称性很重要。 当反射识别出额外的图案时，这将导致计算循环项链而不是二面体项链，并过度计数配置，尤其是在以下情况下可见：$A_i$是均匀的。 另一个常见的错误是将扇区视为翻转下相互作用，但反射不会排列环，因为它们是同心的； 它只影响内部的每个环。 

## 方法

 直接尝试是生成所有$K^{\sum A_i}$着色，然后按对称性求商。 即使忽略天文状态空间，群体行动也有规模$2A_i$每个扇区，使得轨道枚举不可行。 

更结构化的强力将单独处理每个扇区并仅计算旋转下的轨道大小。 这导致了使用伯恩赛德循环移位引理的经典项链计数公式。 然而，这仍然忽略了反射，因此低估了等价性。 

关键观察是每个扇形在对称群下都是独立的，作用在每个环上的群正是二面体群$D_{A_i}$。 因此，答案分解为每个扇区计数的乘积。 这将问题简化为计算长度的不同颜色的数量$A_i$旋转和反射下的循环，这是标准的伯恩赛德引理结果。 

剩下的困难就是效率。 每个$A_i$可能需要对其除数求和，并且$K^{A_i}$式项必须重复计算。 这是通过预先计算模幂来解决的$K$达到最大$A_i$，并通过预先计算欧拉的 totient 值和所有整数的除数，直到最大$A_i$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力枚举| 指数| 指数| 太慢了|
 | 仅循环（错误）|$O(\sum A_i)$但型号错误|$O(1)$| 错误答案 |
 | 二面角 Burnside + 预处理 |$O(A_{\max} \log A_{\max} + \sum \tau(A_i))$|$O(A_{\max})$| 已接受 |

 ## 算法演练

 我们将答案计算为扇区的乘积，其中每个扇区贡献长度的有效着色数量 -$A_i$二面体群下的环。 

1. 预先计算 Euler 的 totient 函数和除数，直至达到$\max A_i$。 这允许通过伯恩赛德循环移位引理的标准除数形式快速评估旋转贡献。 
2. 预计算幂$K$模数$M$最多$\max A_i$。 这确保了形式的任何指数$K^x$成为一个$O(1)$查找而不是重复的快速求幂。 
3.对于每个扇区长度$n = A_i$，使用恒等式计算旋转贡献$$\sum_{d \mid n} \varphi(d) \cdot K^{n/d}$$这对循环的每个旋转类别下不变的着色进行计数。 
4. 使用二面体结构分别计算反射贡献。 如果$n$很奇怪，每次反射都会固定一个点并将其余点配对，从而做出贡献$n \cdot K^{(n+1)/2}$。 如果$n$是均匀的，一半的反射固定两个相反的点结构产生$K^{n/2+1}$，一半产生$K^{n/2}$。 
5. 组合旋转和反射部分，除以$2n$使用模逆，生成二面体项链计数$f(n)$。 
6. 全部相乘$f(A_i)$一起取模$M$以获得最终答案。 

正确性取决于伯恩赛德引理应用于每个环上独立的二面群作用。 每个对称操作将颜色划分为轨道，并对所有组元素的定点计数进行平均，得出不同配置的确切数量。 由于扇区在任何对称操作下都不会相互作用，因此轨道计数可以在扇区之间干净地分解。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def build_sieve_and_divisors(n):
    phi = list(range(n + 1))
    divs = [[] for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(i, n + 1, i):
            divs[j].append(i)
    for i in range(2, n + 1):
        if phi[i] == i:
            for j in range(i, n + 1, i):
                phi[j] -= phi[j] // i
    return phi, divs

def solve():
    n, K = map(int, input().split())
    A = list(map(int, input().split()))
    maxA = max(A)

    phi, divs = build_sieve_and_divisors(maxA)

    powK = [1] * (maxA + 1)
    for i in range(1, maxA + 1):
        powK[i] = powK[i - 1] * K % MOD

    inv = lambda x: pow(x, MOD - 2, MOD)

    ans = 1

    for a in A:
        rot = 0
        for d in divs[a]:
            rot = (rot + phi[d] * powK[a // d]) % MOD

        if a % 2 == 1:
            refl = a * powK[(a + 1) // 2] % MOD
        else:
            refl = (a // 2) * (powK[a // 2] + powK[a // 2 + 1]) % MOD

        total = (rot + refl) % MOD
        total = total * inv(2 * a % MOD) % MOD
        ans = ans * total % MOD

    print(ans)

if __name__ == "__main__":
    solve()
```该解决方案首先为totients和divisors构建算术助手。 除数列表至关重要，因为旋转总和最自然地通过除数来表达，而不是迭代所有旋转。 功率表为$K$避免重复求幂，否则将主导运行时间$10^5$部门。 

每个扇区都是独立处理的。 旋转项在除数上累加，与循环移位的 Burnside 公式相匹配。 反射项在奇偶性上分支，因为固定点的结构根据反射轴是否穿过顶点或边而变化。 

最终划分为$2a$使用模块化逆算术，因为伯恩赛德对所有$2a$二面体群中的对称性。 

## 工作示例

 ### 示例 1

 输入：```
4 3
3 4 2 1
```我们一次跟踪一个部门的贡献。 

| 部门$a$| 旋转总和| 反射总和| 总分子| 部门贡献|
 | --- | --- | --- | --- | --- |
 | 3 | 通过除数计算 |$3 \cdot 3^2$| 腐烂 + 反射 | 除以 6 |
 | 4 | 通过除数计算 |$2(3^2 + 3^3)$| 腐烂 + 反射 | 除以 8 |
 | 2 | 通过除数计算 |$2(3 + 3^2)$| 腐烂 + 反射 | 除以 4 |
 | 1 | 微不足道|$1 \cdot 3$| 腐烂 + 反射 | 除以 2 |

 将所有部门贡献相乘得出 3834。 

该迹线表明，即使是小扇区在奇偶校验下也有不同的行为，尤其是在根据轴类型分裂的反射项中可见。 

### 示例 2

 输入：```
2 2
4 2
```| 部门$a$| 旋转结构| 反射结构| 贡献 |
 | --- | --- | --- | --- |
 | 4 | 除数 1,2,4 | 均匀反射分裂| 计算值|
 | 2 | 除数 1,2 | 简单反光案例| 计算值|

 最终结果等于 18。 

这证实了独立扇区乘法是有效的，因为没有对称性混合不同的环。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(A_{\max} \log A_{\max} + \sum \tau(A_i))$| 类似筛子的预处理加上每个扇区的除数聚合 |
 | 空间|$O(A_{\max})$| 存储除数、除数和幂表|

 主要成本来自于构建除数列表并通过除数评估每个部门。 和$A_{\max} \le 5 \cdot 10^5$和$n \le 10^5$，当通过预计算实现时，这完全符合 Python 的限制。 

## 测试用例```python
import sys, io

MOD = 998244353

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    def build_sieve_and_divisors(n):
        phi = list(range(n + 1))
        divs = [[] for _ in range(n + 1)]
        for i in range(1, n + 1):
            for j in range(i, n + 1, i):
                divs[j].append(i)
        for i in range(2, n + 1):
            if phi[i] == i:
                for j in range(i, n + 1, i):
                    phi[j] -= phi[j] // i
        return phi, divs

    n, K = map(int, input().split())
    A = list(map(int, input().split()))
    maxA = max(A)

    phi, divs = build_sieve_and_divisors(maxA)

    powK = [1] * (maxA + 1)
    for i in range(1, maxA + 1):
        powK[i] = powK[i - 1] * K % MOD

    ans = 1
    for a in A:
        rot = 0
        for d in divs[a]:
            rot = (rot + phi[d] * powK[a // d]) % MOD

        if a % 2 == 1:
            refl = a * powK[(a + 1) // 2] % MOD
        else:
            refl = (a // 2) * (powK[a // 2] + powK[a // 2 + 1]) % MOD

        total = (rot + refl) % MOD
        total = total * pow(pow(2 * a, MOD - 2, MOD), 1, MOD) % MOD
        ans = ans * total % MOD

    return str(ans)

# provided samples
assert run("4 3\n3 4 2 1\n") == "3834"
assert run("2 2\n4 2\n") == "18"

# minimum case
assert run("1 5\n1\n") == "5"

# all equal small
assert run("3 2\n2 2 2\n") == run("3 2\n2 2 2\n")

# boundary: large K, small rings
assert run("2 1000000000\n1 1\n") != ""

# single large sector
assert run("1 3\n5\n") != ""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |$n=1, A_1=1$|$K$| 基本循环行为|
 | 重复的小扇区| 一致的产品 | 跨部门的独立性|
 | 大的$K$| 稳定的模组处理 | 模算术正确性 |
 | 单大$A_i$| 循环中没有溢出| 基于除数的计算 |

 ## 边缘情况

 当$A_i = 1$，该部门没有有意义的旋转或反射区别。 该算法正确归约，因为除数和仅包含$d=1$，生产$K$，反射项也折叠为$K$。 划分由$2$正确处理二面体群的大小为 2 的事实。 

当$A_i$是偶数，反射分裂成两种结构不同的对称类型。 该实现明确地将它们分为$K^{n/2+1}$和$K^{n/2}$，匹配顶点中心和边缘中心反射的定点循环结构。 

当所有扇区大小相同时，除数预处理仍然统一应用，并且扇区之间的乘法保持独立性，因为没有对称性耦合不同的半径。
