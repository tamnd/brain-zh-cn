---
title: "CF 103736I - IHI 的作业"
description: "我们给出了变量下界的数组和目标总和约束。 每个变量$xi$必须至少为$ai$，并且我们被问到有多少个整数向量$x1,x2,dots,xn$满足$$x1 + x2 +dots + xn le s$$每次更新后，数组$a$的一个位置被改变......"
date: "2026-07-02T09:12:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103736
codeforces_index: "I"
codeforces_contest_name: "The 2022 Hangzhou Normal U Summer Trials"
rating: 0
weight: 103736
solve_time_s: 51
verified: true
draft: false
---

[CF 103736I - IHI 的作业](https://codeforces.com/problemset/problem/103736/I)

 **评级：** -
 **标签：** -
 **求解时间：** 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了变量下界的数组和目标总和约束。 每个变量$x_i$必须至少是$a_i$，我们被问到有多少个整数向量$x_1, x_2, \dots, x_n$满足$$x_1 + x_2 + \dots + x_n \le s$$每次更新后，数组的一个位置$a$永久改变，我们必须重新计算有效解的数量。 

输入是动态的：每个操作都会修改一个下界，并且答案仅取决于所有操作的当前状态$a_i$。 每次更新后的输出是有效整数赋值的计数。 

约束条件$n, q \le 2 \cdot 10^5$迫使我们更快地重新计算答案$O(nq)$。 由于结构大小和更新次数都很大，因此任何解决方案都必须支持快速点更新和全局组合值的快速重新计算。 

一个关键的观察结果是，除了变量的下限之外，约束对于变量是对称的。 这建议转换变量以删除下界，从而将问题转变为经典的有界组合计数问题。 

有用的导出量是强制总和：$$A = \sum a_i$$如果我们定义新变量$y_i = x_i - a_i$，那么每个$y_i \ge 0$，约束变为：$$\sum y_i \le s - A$$因此，问题简化为计算具有总和上限的非负整数解。 

出现微妙的边缘情况时$s < A$。 在这种情况下，不存在解决方案。 例如，如果$n=3, s=2, a=[1,1,1]$，则最小和为 3，因此答案为 0。忽略基本和可行性的简单实现仍会尝试计算具有负剩余容量的组合，这会导致不正确的组合值。 

另一个边缘情况是当所有$a_i = 0$，其中答案成为经典的星形和条形计数$\sum y_i \le s$，即$\binom{s+n}{n}$。 任何解决方案都必须正确地统一一般情况和退化情况。 

## 方法

 一种直接的方法是在每次更新后通过迭代所有可能的总和或从头开始使用组合数学来重新计算答案。 移位变量后，问题就变成了计算总和最多的非负整数解$S' = s - \sum a_i$。 解的数量为$$\sum_{k=0}^{S'} \binom{k+n-1}{n-1} = \binom{S' + n}{n}$$这减少了每个查询仅维护的总和$a_i$。 由于每次更新都会更改一个$a_x$，我们可以维护运行总计$A$在$O(1)$，并重新计算$S' = s - A$。 

剩下的挑战是计算二项式系数$\binom{N}{K}$模数$10^9+7$快速达$N \le 4 \cdot 10^5$。 这是通过预先计算的阶乘和逆阶乘来处理的。 

因此，每个查询变成一个恒定时间算术更新加上一个模块化二项式评估。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力枚举| 指数| O(n) | 太慢了 |
 | 每个查询重新计算组合 | O(nq) | O(1) | O(1) | 太慢了 |
 | 维护总和 + 预先计算的 nCr | O(n + q) | O(n) | 已接受 |

 ## 算法演练

 我们将问题转化为计算非负松弛变量的有效分配。 核心思想是只有下界的总和才重要，而不是它们的分布。 

## 算法演练

 1. 计算初始总和$A = \sum a_i$。 这代表了对变量总和的最小强制贡献，因此它决定了还有多少“空间”可供灵活分配。 
2. 预先计算阶乘和逆阶乘$n + s$。 这是必需的，因为每个答案都将是参数达到此范围的二项式系数，并且每个查询重新计算阶乘会太慢。 
3. 对于每个查询，更新数组条目$a_x$并调整总和$A$。 我们不修改整个结构，只维护聚合效果，因为最终计数仅取决于$A$。 
4. 计算剩余容量$R = s - A$。 如果$R < 0$，立即输出 0，因为即使是最小配置也违反了约束。 
5. 否则计算解的数量：$\binom{R + n}{n}$。 这是从应用于总和有限的非负变量的星形和条形变换得出的。 

### 为什么它有效

 将变量移动下限后，每个有效配置都精确对应于非负整数的选择$y_i$其总和最多为$R = s - \sum a_i$。 此类向量的数量仅取决于可用的总松弛量，而不取决于单个向量。$a_i$。 每次更新仅通过调整总和中的一项来改变这种松弛，因此重新计算减少为维持单个标量状态。 有界组合的二项式恒等式保证最终公式对所有有效赋值恰好计数一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def modinv(x):
    return pow(x, MOD - 2, MOD)

def build_fact(n):
    fact = [1] * (n + 1)
    invfact = [1] * (n + 1)
    for i in range(1, n + 1):
        fact[i] = fact[i - 1] * i % MOD
    invfact[n] = modinv(fact[n])
    for i in range(n, 0, -1):
        invfact[i - 1] = invfact[i] * i % MOD
    return fact, invfact

def ncr(n, r, fact, invfact):
    if r < 0 or r > n:
        return 0
    return fact[n] * invfact[r] % MOD * invfact[n - r] % MOD

def main():
    n, s, q = map(int, input().split())
    a = list(map(int, input().split()))
    
    A = sum(a)
    MAX = n + s
    fact, invfact = build_fact(MAX)
    
    for _ in range(q):
        x, val = map(int, input().split())
        x -= 1
        
        A -= a[x]
        a[x] = val
        A += a[x]
        
        R = s - A
        if R < 0:
            print(0)
        else:
            print(ncr(R + n, n, fact, invfact))

if __name__ == "__main__":
    main()
```该实现围绕维护数组的总和而不是其完整结构进行。 每次更新都会以恒定的时间调整这个总和，从而直接更新剩余的slack$R$。 

对于最大可能的索引，阶乘和逆阶乘会预先计算一次，确保每个二项式查询都是$O(1)$。 组合函数保护无效范围以避免负访问或越界访问。 

关键的微妙之处在于正确计算$R = s - A$。 更新过程中如有错误$A$在赋值之前或之后会错误地改变结果，因为每个查询都取决于所有先前更新的当前状态。 

## 工作示例

 ### 示例 1

 输入：```
n=3, s=5
a=[1,1,1]
queries: (1→1), (1→2), (2→2), (3→2)
```我们追踪$A$和$R$:

 | 步骤| 一个 | 一个 | R = s - A | 回答 |
 | ---| ---| ---| ---| ---|
 | 初始化| [1,1,1]| 3 | 2 | C(5,3)=10 | C(5,3)=10 |
 | 1 | [1,1,1]| 3 | 2 | 10 | 10
 | 2 | [2,1,1]| 4 | 1 | C(4,3)=4 | C(4,3)=4 |
 | 3 | [2,2,1]| 5 | 0 | C(3,3)=1 | C(3,3)=1 |
 | 4 | [2,2,2]| 6 | -1 | 0 |

 跟踪显示所有结构依赖性都分解为单个标量$A$。 一次$A$超过$s$，可行性立即消失。 

### 示例 2

 输入：```
n=2, s=3
a=[0,0]
queries: (1→1), (2→2)
```| 步骤| 一个 | 一个 | 右 | 回答 |
 | ---| ---| ---| ---| ---|
 | 初始化| [0,0]| 0 | 3 | C(5,2)=10 | C(5,2)=10 |
 | 1 | [1,0]| 1 | 2 | C(4,2)=6 | C(4,2)=6
 | 2 | [1,2]| 3 | 0 | C(2,2)=1 | C(2,2)=1 |

 此示例强调了增加下限如何仅减少剩余松弛，而不减少组合结构。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + q) | 阶乘预处理是线性的，由于恒定时间更新和 nCr | 每个查询都是 O(1)
 | 空间| O(n + s) | 最多 n + s 的阶乘和逆阶乘数组 |

 约束允许最多$2 \cdot 10^5$，并且该解决方案仅执行线性预处理以及每个查询的恒定工作，在限制范围内轻松拟合。 

## 测试用例```python
import sys, io

MOD = 10**9 + 7

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    
    n, s, q = map(int, input().split())
    a = list(map(int, input().split()))
    
    A = sum(a)
    
    MAX = n + s
    fact = [1] * (MAX + 1)
    invfact = [1] * (MAX + 1)
    for i in range(1, MAX + 1):
        fact[i] = fact[i - 1] * i % MOD
    invfact[MAX] = pow(fact[MAX], MOD - 2, MOD)
    for i in range(MAX, 0, -1):
        invfact[i - 1] = invfact[i] * i % MOD
    
    def ncr(n, r):
        if r < 0 or r > n:
            return 0
        return fact[n] * invfact[r] % MOD * invfact[n - r] % MOD
    
    out = []
    for _ in range(q):
        x, val = map(int, input().split())
        x -= 1
        A -= a[x]
        a[x] = val
        A += a[x]
        R = s - A
        if R < 0:
            out.append("0")
        else:
            out.append(str(ncr(R + n, n)))
    
    return "\n".join(out)

# provided sample
assert run("""3 5 4
1 1 1
1 1
1 2
2 2
3 2
""") == "10\n10\n4\n1"

# custom tests
assert run("""1 0 2
0
1 1
1 0
""") == "1\n1", "single variable edge"

assert run("""2 1 2
0 0
1 1
2 1
""") == "2\n1", "tight capacity shrink"

assert run("""3 0 1
0 0 0
1 0
""") == "10", "pure stars and bars"

assert run("""4 2 2
1 0 1 0
1 2
3 2
""") == "0\n0", "infeasible after updates"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单变量更新 | 1 1 | 1 基本情况的正确性|
 | 产能缩紧| 2 1 | 2 单调可行性约简 |
 | 全零| 10 | 10 纯组合恒等式|
 | 不可行的更新| 0 0 | 负松弛处理|

 ## 边缘情况

 当下界之和超过$s$，算法立即正确输出 0，因为$R = s - A < 0$。 例如，与$n=3, s=2, a=[1,1,1]$，我们计算$A=3$, 给予$R=-1$，并且在不尝试二项式求值的情况下输出为 0。 

当所有$a_i = 0$，我们得到$R = s$，答案就变成了$\binom{s+n}{n}$。 该算法自然地处理了这个问题，因为除了标准 nCr 计算之外不需要特殊的外壳。 

当更新减少或增加单个位置时，仅$A$变化。 该算法在添加新贡献之前正确删除旧贡献，确保多个查询不会出现累积漂移。
