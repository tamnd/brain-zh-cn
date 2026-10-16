---
title: "CF 106251G - 忙碌海狸的故障机器"
description: "我们得到一个正整数 $X$，以 $B$ 为基数编写为数字序列。 任务是确定是否存在两个正整数 $Y$ 和 $Z$，使得：$$X + Y = Z$$ 以及 $Y$ 和 $Z$ 的基 $B$ 表示包含完全相同的数字多重集。"
date: "2026-06-25T07:22:54+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106251
codeforces_index: "G"
codeforces_contest_name: "MITIT Winter 2025-26 Beginner Round"
rating: 0
weight: 106251
solve_time_s: 56
verified: true
draft: false
---

[CF 106251G - 忙碌海狸的故障机器](https://codeforces.com/problemset/problem/106251/G)

 **评级：** -
 **标签：** -
 **求解时间：** 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给定一个正整数$X$写在基础上$B$作为数字序列。 

任务是判断是否存在两个正整数$Y$和$Z$这样：$$X + Y = Z$$和基地-$B$的表示$Y$和$Z$包含完全相同的多组数字。 数字的顺序可能不同，但每个数字在两个数字中出现的次数必须相同。 

如果存在这样的数字，我们必须输出一对有效的数字。 否则，我们输出`NO`。 

输入尺寸很大。 单个数字最多可以包含$10^5$位数，所有测试用例的位数最多为$2 \cdot 10^5$。 任何尝试将整个值转换为内置整数类型的解决方案都是不可能的。 我们需要一种直接在基础上工作的算法$B$数字表示并以线性时间运行。 

最重要的观察来自数字和。 具有相同多组数字的任何两个数字都具有完全相同的数字和。 在基地$B$,$$N \equiv \text{sum of digits of } N \pmod{B-1}.$$自从$Y$和$Z$使用相同的数字，$$Y \equiv Z \pmod{B-1}.$$使用$Z-Y=X$,$$X \equiv 0 \pmod{B-1}.$$这是必要条件。 

粗心的实现可能会停在这里，只测试可分性。 更困难的部分是证明这个条件也是充分的并构造一个有效的答案。 

考虑 base 中的一个小例子$10$：```
X = 36
```数字和是$3+6=9$， 所以$X$可以整除$9$。 一个有效的答案是```
Y = 105
Z = 150
```两者都使用数字`{1,0,5}`， 和$$150 - 105 = 45 \neq 36.$$拥有相同的数字是不够的。 构造必须精确地产生所需的差异。 

另一个边缘情况是当$X$只有一位数字。```
B = 2
X = 1
```自从$B-1=1$，每个数字都可以被$B-1$。 解决方案必须仍然存在。 任何假设商有多个数字的方法在这里都会失败。 

第三种微妙的情况是除法后商包含前导零。 例如，```
B = 10
X = 18
```然后$X/(B-1)=2$。 商的表示形式很简单`[2]`， 不是`[0,2]`。 长除法必须正确删除前导零。 

## 方法

 蛮力的想法是生成候选数字多重集，构建所有排列$Y$和$Z$，并检查是否$Z-Y=X$。 这仅适用于极小的输入，因为排列的数量随着数字的数量呈阶乘增长。 即使是 20 的长度也已经使搜索完全不可行。 

关键的观察是模运算。 

因为$Y$和$Z$包含相同的数字，它们的数字和也相同。 在基地$B$，每个数字都与其模数之和一致$B-1$。 因此$$Y \equiv Z \pmod{B-1}.$$自从$X=Z-Y$,$$X \equiv 0 \pmod{B-1}.$$This immediately gives a necessary condition.

 令人惊讶的是，它也足够了。 

让$$K=\frac{X}{B-1}.$$假设基数为$B$的数字$K$是$$d_1,d_2,\ldots,d_m.$$构造$$Y = (1,0,d_1,d_2,\ldots,d_m)_B$$和$$Z = (1,d_1,d_2,\ldots,d_m,0)_B.$$这两个数字显然包含完全相同的数字：都包含一位数字`1`, 一位数`0`，以及所有数字$K$。 

从数字上看，$$Y = 1\cdot B^{m+1}+K,$$

$$Z = 1\cdot B^{m+1}+B\cdot K.$$减去，$$Z-Y=(B-1)K=X.$$所以每$X$可除以$B-1$承认一个解决方案。 

整个问题简化为：

 1. 检查是否$X$可以整除$B-1$。 
2.如果没有，输出`NO`。 
3. 否则计算$K=X/(B-1)$对数字数组使用长除法。 
4. 输出上述结构。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数| 指数| 太慢了|
 | 最佳| O(N) | O(N) | 已接受 |

 ## 算法演练

 1. 阅读基础-$B$的数字$X$。 
2. 计算数字和模$B-1$。 

自从$B \equiv 1 \pmod{B-1}$，一个数可以被$B-1$恰好当它的数字和可以被整除时$B-1$。 
3. 如果余数非零，则输出`NO`。 

不存在有效的数字对，因为任何两个具有相同数字多重集的数字模全等$B-1$。 
4. 划分数字数组$X$经过$B-1$在基数中使用标准长除法$B$。 

保持余数。 对于每个数字，更新$$cur = remainder \cdot B + digit,$$发射$$cur // (B-1),$$并保留$$cur \bmod (B-1).$$5. 从商中删除前导零数字。 其余数字是基数$B$的代表$K$。 
6. 设商位数为$d_1,\ldots,d_m$。 
7. 输出$$Y=(1,0,d_1,\ldots,d_m)$$和$$Z=(1,d_1,\ldots,d_m,0).$$### 为什么它有效

 可整性测试是必要的，因为等位多重集意味着等位数字和，并且数字与其模数的数字和一致$B-1$。 因此每个有效的$X$必须满足$X \equiv 0 \pmod{B-1}$。 

当这个条件成立时，我们定义$K=X/(B-1)$。 该结构将相同的数字放入$Y$和$Z$，只是改变了他们的立场。 他们的前导数字总是`1`，所以两个数字都没有前导零。 

数值差异为$$(1\cdot B^{m+1}+BK) - (1\cdot B^{m+1}+K)
= (B-1)K
= X.$$因此，该结构满足了两个所需的属性，证明了充分性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
out = []

for _ in range(t):
    n, b = map(int, input().split())
    a = list(map(int, input().split()))

    mod = b - 1

    if sum(a) % mod != 0:
        out.append("NO")
        continue

    # Long division: X / (B - 1)
    q = []
    rem = 0

    for digit in a:
        cur = rem * b + digit
        q.append(cur // mod)
        rem = cur % mod

    idx = 0
    while idx < len(q) - 1 and q[idx] == 0:
        idx += 1
    q = q[idx:]

    m = len(q) + 2

    y = [1, 0] + q
    z = [1] + q + [0]

    out.append("YES")
    out.append(str(m))
    out.append(" ".join(map(str, y)))
    out.append(" ".join(map(str, z)))

sys.stdout.write("\n".join(out))
```第一部分检查整除性$B-1$使用数字和规则。 这避免了重建的巨大价值$X$。 

长除法部分计算$K=X/(B-1)$直接来自数字数组。 每个中间值最多是$$(B-2)\cdot B + (B-1) < B^2,$$它很容易适合标准整数。 

除法后，前导零被删除。 这很重要，因为商必须以规范形式表示。 

最终的构造就是证明。 两个数组包含相同的数字，都不以零开头，它们的差等于$X$。 

## 工作示例

 ### 示例 1

 输入：```
N = 2, B = 10
X = [3, 6]
```数字和为$9$，可除以$9$。 

长除法$9$：

 | 职位| 数字| 当前值| 商数字 | 剩余|
 | ---| ---| ---| ---| ---|
 | 1 | 3 | 3 | 0 | 3 |
 | 2 | 6 | 36 | 36 4 | 0 |

 所以$K=[4]$。 

施工：

 | 变量| 数字 |
 | ---| ---|
 | 是 | [1, 0, 4] |
 | Z| [1, 4, 0] |

 从数字上看，$$140 - 104 = 36.$$这展示了核心结构。 

### 示例 2

 输入：```
N = 4, B = 5
X = [1, 4, 3, 4]
```数字和：$$1+4+3+4=12.$$自从$12 \equiv 0 \pmod 4$，存在解。 

长除法$4$：

 | 职位| 数字| 当前值| 商数字 | 剩余|
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 1 | 0 | 1 |
 | 2 | 4 | 9 | 2 | 1 |
 | 3 | 3 | 8 | 2 | 0 |
 | 4 | 4 | 4 | 1 | 0 |

 商数为`[2, 2, 1]`。 

施工：

 | 变量| 数字 |
 | ---| ---|
 | 是 | [1, 0, 2, 2, 1] |
 | Z| [1, 2, 2, 1, 0] |

 这两个数字使用完全相同的数字，它们的区别就是原来的数字$X$。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N) | 一次可分扫描和一次长分扫描 |
 | 空间| O(N) | 存储商数字并输出 |
 | | | |

 所有测试用例中处理的数字总数最多为$2 \cdot 10^5$，因此线性复杂度很容易符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline
    t = int(input())
    out = []

    for _ in range(t):
        n, b = map(int, input().split())
        a = list(map(int, input().split()))

        mod = b - 1

        if sum(a) % mod != 0:
            out.append("NO")
            continue

        q = []
        rem = 0

        for digit in a:
            cur = rem * b + digit
            q.append(cur // mod)
            rem = cur % mod

        idx = 0
        while idx < len(q) - 1 and q[idx] == 0:
            idx += 1
        q = q[idx:]

        m = len(q) + 2
        y = [1, 0] + q
        z = [1] + q + [0]

        out.append("YES")
        out.append(str(m))
        out.append(" ".join(map(str, y)))
        out.append(" ".join(map(str, z)))

    return "\n".join(out)

# sample NO case
assert run(
"""1
5 12
4 8 8 3 1
"""
) == "NO"

# base 2, minimum length
assert run(
"""1
1 2
1
"""
).startswith("YES")

# divisible by B-1
assert run(
"""1
2 10
3 6
"""
).startswith("YES")

# not divisible
assert run(
"""1
1 10
5
"""
) == "NO"

# all digits zero except leading digit
assert run(
"""1
3 10
9 0 0
"""
).startswith("YES")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`5 12 / 4 8 8 3 1`|`NO`| 不满足整除条件 |
 |`1 2 / 1`|`YES`| 尽可能最小的尺寸 |
 |`2 10 / 3 6`|`YES`| 基本建设案例|
 |`1 10 / 5`|`NO`| 不可整除的个位数 |
 |`3 10 / 9 0 0`|`YES`| 除法后带前导零的商 |

 ## 边缘情况

 考虑：```
1
1 10
5
```数字和是$5$。 自从$5 \not\equiv 0 \pmod 9$，算法立即输出`NO`。 任何有效的对都需要$X\equiv0\pmod9$，所以拒绝是正确的。 

考虑：```
1
1 2
1
```这里$B-1=1$。 每个整数都可以被$1$。 长除法给出$K=1$。 建设产生```
Y = [1,0,1]
Z = [1,1,0]
```和$$110_2 - 101_2 = 1.$$自然地处理尽可能小的输入。 

考虑：```
1
2 10
1 8
```我们有$18/9=2$。 长除法最初生成商数字`[0,2]`。 前导零被删除，留下`[2]`。 然后该构造使用规范表示$K$，防止输出中出现意外的前导零。
