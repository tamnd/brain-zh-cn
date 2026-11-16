---
problem: 983A
contest_id: 983
problem_index: A
name: "Finite or not?"
contest_name: "Codeforces Round 483 (Div. 1) [Thanks, Botan Investments and Victor Shaburov!]"
rating: 1700
tags: ["implementation", "math"]
answer: passed_samples
verified: true
solve_time_s: 67
date: 2026-06-18
model: gpt-5-5
samples_passed: 1
samples_total: 1
share_url: https://chatgpt.com/share/6a33757e-78f4-83ec-b62c-055c2636f4e3
---

# CF 983A - 是否有限？ 

**评分：** 1700
 **标签：** 实现、数学
 **型号：** gpt-5-5
 **求解时间：** 1m 7s
 **已验证：** 是（1/1 样品）
 **分享：** https://chatgpt.com/share/6a33757e-78f4-83ec-b62c-055c2636f4e3

 ---

 ## 解决方案

 ## 问题理解

 给定一个有理数$p/q$并要求确定其表示形式在用基数编写时是否是有限的$b$。 有限表示意味着在某个点之后，扩展停止并且不需要更多的数字，类似于$1/2 = 0.5$以 10 为基数。 

每个查询给出三个整数：一个分子$p$, 分母$q$，和一个底座$b$。 任务不是计算展开，而只是决定它是否终止。 

约束条件很大：最多$10^5$查询和值最多$10^{18}$。 这排除了任何模拟除法或逐位构建表示的方法。 即使每个查询进行一次长除法也是不可行的，因为分母和基数可能足够大，以至于中间状态需要任意精度算术并且可能需要多次迭代。 

一个微妙的点是$p$与表示的有限性无关。 例如，$6/12$和$1/2$在任何基地都有相同的终止行为。 所以问题根本上是关于$q$和$b$，不是关于$p$。 

当分数已经是整数时，就会出现边缘情况。 例如，如果$p = 12$和$q = 3$，结果是$4$，无论基数如何，它总是终止。 幼稚的方法可能仍会尝试不必要地分析素因数，但这种情况应立即归类为有限。 

当基数共享约化分母的所有质因数时，就会出现另一种边缘情况。 例如，$1/3$基数 3 是有限的，因为$3$划分基地。 以 10 为底，它是无限的，因为$3$不分开$2 \cdot 5$。 

## 方法

 蛮力解释将尝试模拟除法$p/q$在基地$b$，将余数重复乘以$b$并提取数字。 原则上这是可行的，因为当余数在某个步骤变为零时，分数恰好终止。 然而，其余部分可以循环很长时间，可能长达$q$不同的状态。 和$q$一样大$10^{18}$，即使对于单个查询，这也是不可能的。 

关键的结构洞察力是摆脱表示形式，转而研究数论。 有理数的基数具有有限展开式$b$恰好当减少的分母除了已经存在的素因子之外没有素因子时$b$。 减少后$p/q$最低限度而言，该条件仅取决于是否$q$也分$b$。 

这将问题简化为重复的 gcd 简化，然后从$q$所有因素共享$b$。 如果有任何东西残留在$q$，剩下的部分引入了一个不相容的素因子，迫使无限扩展。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力（模拟除法）|$O(q)$每个查询 |$O(1)$| 太慢了|
 | 最优（通过 gcd 剥离减少质因子）|$O(\log \min(q,b))$按查询摊销|$O(1)$| 已接受 |

 ## 算法演练

 我们独立处理每个查询。 

1.首先通过计算减少分数$g = \gcd(p, q)$和设置$q \leftarrow q/g$。 

这一步删除了所有公因数，以便我们只分析不可约分母。 之前共享的任何因素都不会影响终止，因为它会在分数中抵消。 
2. 删除自$q$基数中也存在的所有素因子$b$。 

我们反复计算$g = \gcd(q, b)$。 如果$g > 1$，我们划分$q \leftarrow q/g$。 

这有效是因为$\gcd(q, b)$即使不因式分解任何一个数字，也能准确提取共享素数的乘积。 
3. 重复上一步，直到$\gcd(q, b) = 1$。 此时，已无剩余因子$q$可以由以下权力产生$b$。 
4.如果最终$q$等于 1，分母已被底数完全吸收，表示终止。 否则，至少有一个素因数$q$不兼容$b$，使扩张无限大。 

### 为什么它有效

 有理数的基数有终止展开式$b$恰好当它的约分母除以某些幂时$b$。 That condition is equivalent to saying every prime factor of the denominator must also appear in$b$。 重复的 gcd 去除过程系统地去除$q$所有因素都符合$b$。 如果有什么东西幸存下来，它就是一个素因数，永远不能通过乘以来引入$b$，这保证了基数扩展中的余数永远不会消失。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

import math

def solve():
    n = int(input())
    for _ in range(n):
        p, q, b = map(int, input().split())

        g = math.gcd(p, q)
        q //= g

        # remove all factors of q that are in b
        while True:
            g = math.gcd(q, b)
            if g == 1:
                break
            while q % g == 0:
                q //= g

        if q == 1:
            print("Finite")
        else:
            print("Infinite")

if __name__ == "__main__":
    solve()
```第一步将分数减少到最低项，确保我们不会携带不相关的因素$p$。 然后，循环使用 gcd 重复提取分母和底数之间的任何重叠，即使对于$10^{18}$- 大小的数字。 

内部除法循环是必要的，因为$\gcd(q, b)$一个因素可能会多次出现，我们必须将其完全从$q$在重新计算之前。 这保证了每次迭代都严格减少$q$, preventing infinite looping.

 ## 工作示例

 ### 示例 1

 输入：```
6 12 10
```| 步骤| p| 问 | 乙| gcd(q,b) | gcd(q,b) | 行动|
 | --- | --- | --- | --- | --- | --- |
 | 初始化| 6 | 12 | 12 10 | 10 - | 减少分数 |
 | 减少| 6 | 2 | 10 | 10 - | 除以 gcd(6,12)=6 |
 | 循环| 6 | 2 | 10 | 10 2 | 删除因子 2 |
 | 决赛| 6 | 1 | 10 | 10 1 | 停止|

 自从$q = 1$，输出是有限的。 

这表明，一旦分母完全由基本因子组成，展开就会终止。 

### 示例 2

 输入：```
4 3 10
```| 步骤| p| 问 | 乙| gcd(q,b) | gcd(q,b) | 行动|
 | --- | --- | --- | --- | --- | --- |
 | 初始化| 4 | 3 | 10 | 10 - | 减少分数 |
 | 减少| 4 | 3 | 10 | 10 - | 已经减少|
 | 循环| 4 | 3 | 10 | 10 1 | 立即停止 |

 自从$q = 3 \neq 1$，输出为无穷大。 

这显示了分母包含底数中不存在的素数的情况，因此不可能进行约简。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(\log q \cdot \log b)$每个查询 | 每个 gcd 和除法步骤都会减少分母，并且 gcd 以对数时间运行 |
 | 空间|$O(1)$| 仅维护恒定数量的整数 |

 总工作量$10^5$查询仍然高效，因为每个分母在重复 gcd 删除的情况下会快速缩小，并且大输入不会导致长周期。 

## 测试用例```python
import sys, io
import math

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    def solve():
        n = int(input())
        for _ in range(n):
            p, q, b = map(int, input().split())

            g = math.gcd(p, q)
            q //= g

            while True:
                g = math.gcd(q, b)
                if g == 1:
                    break
                while q % g == 0:
                    q //= g

            print("Finite" if q == 1 else "Infinite")

    from io import StringIO
    old_stdout = sys.stdout
    sys.stdout = StringIO()
    solve()
    out = sys.stdout.getvalue()
    sys.stdout = old_stdout
    return out.strip()

# provided samples
assert run("2\n6 12 10\n4 3 10\n") == "Finite\nInfinite"

# custom cases
assert run("1\n0 5 10\n") == "Finite"  # zero numerator
assert run("1\n10 1 2\n") == "Finite"  # integer result
assert run("1\n1 6 10\n") == "Infinite"  # 6 has factor 3
assert run("1\n1 8 2\n") == "Finite"  # denominator only 2-power
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 0/5 | 有限| 零分子边缘情况 |
 | 10/1 | 有限| 整数分数 |
 | 10 进制的 1/6 | 无限 | 缺失素因数 |
 | 1/8 英寸 2 进制 | 有限| 仅兼容素因数 |

 ## 边缘情况

 一种重要的边缘情况是分子为零。 用于输入$0/q$，该值始终为零，在任何基数中都有终止表示。 减少后，$p=0$使$\gcd(p,q)=q$， 所以$q$立即变为 1。 该算法无需任何进一步处理即可正确输出 Finite。 

另一种情况是分数已经是整数时。 例如$10/2$减少到$5/1$。 第一步分母变为 1，算法立即终止。 这避免了不必要的 gcd 循环并确认所有整数值分数的正确性。 

第三种情况是分母仅包含基数中存在但重数很高的因子，例如$1/8$在基数 2 中。重复的 gcd 提取干净地去除了所有因子，因为 gcd 总是提取至少一个与基数结构完全重叠的部分，并且重复除法确保完全消除，最终减少$q$至 1。
