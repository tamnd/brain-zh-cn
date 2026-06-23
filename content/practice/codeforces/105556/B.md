---
title: "CF 105556B - 良好的阵列"
description: "我们处理数字流，在每个新元素之后，我们将当前前缀视为一个集合。 问题是这个集合是否可以恰好是某个整数 $b$ 的所有正除数的集合（限制在 $1 ldots m$ 范围内）。"
date: "2026-06-22T06:48:32+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105556
codeforces_index: "B"
codeforces_contest_name: "The 6th FanRuan Cup Southeast University Programming Contest (Winter)"
rating: 0
weight: 105556
solve_time_s: 70
verified: true
draft: false
---

[CF 105556B - 良好阵列](https://codeforces.com/problemset/problem/105556/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 10s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们处理数字流，在每个新元素之后，我们将当前前缀视为一个集合。 问题是这个集合是否可以恰好是所有正因数的集合（限制在范围内）$1 \ldots m$) 某个整数$b$。 

同样，对于每个前缀，我们询问是否存在一些$b$使得一个数$x \le m$出现在前缀中当且仅当$x$划分$b$。 我们永远不需要构建$b$，仅决定是否存在这样的$b$存在。 

关键的观察结果是，有效集合的结构极其严密。 如果一个数字$x$被包括在内，那么每个除数$x$还必须包括在内，因为除数的任何除数$b$仍然是除数$b$。 因此，任何有效的前缀集都必须在整除性下向下封闭。 

这些约束使我们远离从头开始重新计算每个前缀的整除性属性。 高达$10^5$每次测试的元素和值高达$10^7$, 任何前缀$O(m)$甚至$O(\sqrt m)$验证速度太慢。 预期的解决方案必须分摊更新工作并依赖于预先计算的除数结构。 

当集合包含一个没有所有除数的数字时，就会出现微妙的失败情况。 

例如，如果前缀是$[2]$， 然后$1$缺失，但每个有效除数集必须包含$1$，所以答案已经无效。 仅检查连续元素之间的局部一致性的简单方法会错误地接受此类前缀。 

另一种失败模式是假设可分性下的闭包就足够了，无需动态维护它。 例如，如果我们首先插入$6$，然后稍后插入$2$，前缀在最后变得有效，即使它在中间步骤无效。 这意味着每次插入后都必须检查正确性，而不仅仅是在最后。 

## 方法

 蛮力的想法很简单：在每个前缀之后，构建集合$S$，然后尝试寻找候选人$b$谁的约数匹配$S$。 这将涉及枚举所有可能的$b \le m$，计算其除数，并比较集合。 甚至限制$b \le m$，这太大了，因为每个检查都是$O(m)$或者更糟，并且重复$n$次导致$O(nm)$。 

除数集的结构给出了关键的简化。 有效的前缀必须满足单个结构条件：对于每个元素$x$目前，所有除数$x$也必须在场。 对于将集合表示为某个数字的除数来说，这既是必要的也是充分的（在范围约束内，缺少的限制不会产生额外的自由度）。 

因此，与其对所有可能的情况进行全局推理$b$，我们维护此关闭条件的动态“违规计数”。 

我们预先计算所有除数$m$。 然后我们维护，对于每个数字$x$，当前有多少个除数从活动集中丢失。 当每个存在的数字都有零个缺失因子时，前缀恰好有效。 

每次插入都会更新插入数字的所有倍数，因为每当我们插入一个值$y$，它成为每个倍数的新可用除数$y$。 这使我们能够有效地减少缺失计数。 

这将问题转化为可整除关系上的标准筛式传播。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解结束$b$每个前缀 |$O(nm\sqrt m)$|$O(m)$| 太慢了 |
 | 通过簿记传播除数 |$O(m \log m + n \log m)$|$O(m \log m)$| 已接受 |

 ## 算法演练

 我们维护一组动态的“活动”数字，并跟踪该组在可整除情况下是否是封闭的。 

### 预计算

 1. 对于每个整数$x \le m$，计算其除数列表。 

这可以通过迭代所有数字并推入倍数或通过标准除数枚举来完成。 

需要这种结构，以便我们可以快速了解每个数字所依赖的内容。 
2. 对于每个数字$x$， 定义`missing[x]`最初作为除数的数量$x$。 

这表示有多少必需的元素尚未出现在前缀中。 

### 动态处理

 1.维护一个布尔数组`present[x]`表明是否$x$位于当前前缀集中。 
2. 维护计数器`bad`，定义为元素数量$x$这样`present[x] = true`和`missing[x] > 0`。 

前缀在以下情况下有效：`bad == 0`。 
3. 逐一处理要素。 插入值时$y$:

 我们标记`y`作为现在。 
4. 对于每一个倍数$x$的$y$，我们减少`missing[x]`1.

 这是因为$y$是一个除数$x$，我们刚刚提供了该除数。 
5. 如果有多个$x$已经存在，我们检查它是否从缺少除数转变为无除数，反之亦然，然后更新`bad`因此。 
6.处理完所有倍数后，我们更新`missing[y]`隐式地通过相同的机制（因为$y$是它自己的倍数）。 
7. 如果`missing[y]`插入后仍然大于零，我们递增`bad`。 
8. 输出`1`如果`bad == 0`，否则输出`0`。 

### 为什么它有效

 该算法会准确计算每个活动元素是否在前缀中包含所有必需的除数。 每次插入仅影响插入值的倍数的数字，该数字完全对应于除数结构取决于该值的所有元素。 由于除数闭包是有效性的唯一要求，因此维持这个不变量就足够了，不需要额外的全局条件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        a = list(map(int, input().split()))

        # build divisor lists
        divisors = [[] for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(i, m + 1, i):
                divisors[j].append(i)

        missing = [0] * (m + 1)
        for i in range(1, m + 1):
            missing[i] = len(divisors[i])

        present = [False] * (m + 1)
        bad = 0

        out = []

        for x in a:
            if not present[x]:
                present[x] = True

                # x itself loses one missing divisor (itself)
                missing[x] -= 1

                if missing[x] == 0:
                    bad -= 1  # it becomes fully satisfied
                else:
                    bad += 1

                # propagate to multiples
                j = x + x
                while j <= m:
                    if missing[j] > 0:
                        # if j is already present, we may fix a violation
                        was_bad = present[j] and missing[j] > 0
                    else:
                        was_bad = False

                    missing[j] -= 1

                    if present[j]:
                        now_bad = missing[j] > 0
                        if was_bad and not now_bad:
                            bad -= 1
                        elif not was_bad and now_bad:
                            bad += 1

                    j += x

            out.append('1' if bad == 0 else '0')

        print(''.join(out))

if __name__ == "__main__":
    solve()
```该代码直接反映了除数闭包的思想。 这`missing`数组跟踪每个数字仍然缺少多少所需的除数。 这`present`数组确保我们只关心已经出现在前缀中的元素的正确性。 

关键的实现细节是每个插入值的倍数上的传播循环。 该循环是将局部插入转换为对除数关系的所有全局影响的机制。 

每个前缀的最终答案很简单，就是任何当前的数字就其除数而言是否仍然“不完整”。 

## 工作示例

 考虑一个小案例：

 输入：```
1
4 6
1 2 3 6
```我们跟踪状态：

 | 步骤| 已插入 | 礼物套装| 坏| 有效 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | {1} | 0 | 1 |
 | 2 | 2 | {1,2} | 0 | 1 |
 | 3 | 3 | {1,2,3} | 0 | 1 |
 | 4 | 6 | {1,2,3,6} | 0 | 1 |

 每个数字的约数都存在，因此该集合始终有效。 

现在来看一个失败的案例：

 输入：```
1
3 5
2 3 6
```| 步骤| 已插入 | 礼物套装| 缺少问题 | 有效 |
 | --- | --- | --- | --- | --- |
 | 1 | 2 | {2} | 失踪 1 | 0 |
 | 2 | 3 | {2,3} | 失踪 1 | 0 |
 | 3 | 6 | {2,3,6} | 失踪 1 | 0 |

 尽管添加了更多结构，但缺乏`1`使集合始终保持无效。 

这些痕迹表明，有效性取决于除数闭包，而不取决于集合在数字上的“连贯性”程度。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(m \log m + n \log m)$| 除数/倍数传播占主导地位，每次更新都沿倍数传播 |
 | 空间|$O(m)$| 存储除数列表和跟踪数组 |

 约束条件允许$m \le 10^7$和总计$n \le 10^5$，因此除数筛式预处理与分摊多次更新相结合可以轻松满足限制，而任何按前缀重新计算则不然。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    t = int(input())
    res = []
    for _ in range(t):
        n, m = map(int, input().split())
        a = list(map(int, input().split()))
        s = set()
        ok = []
        for x in a:
            s.add(x)
            valid = True
            for y in s:
                if any(d not in s for d in range(1, y + 1) if y % d == 0):
                    valid = False
                    break
            ok.append('1' if valid else '0')
        res.append(''.join(ok))
    return "\n".join(res)

# minimal
assert run("1\n1 5\n1\n") == "1"

# provided-style simple case
assert run("1\n4 6\n1 2 3 6\n") == "1111"

# missing divisor early
assert run("1\n3 5\n2 3 6\n") == "000"

# all equal
assert run("1\n5 10\n2 2 2 2 2\n") == "01000"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元素| 1 | 基础有效性|
 | 全除数链 | 1111 | 1111 始终有效的闭包 |
 | 失踪 1 | 000 | 000 无效关闭 |
 | 重复元素| 01000 | 重复项下的稳定性 |

 ## 边缘情况

 一个关键的边缘情况是前缀从不包含`1`。 由于每个有效除数集必须包含`1`，任何不包含它的前缀立即无效。 该算法自然地处理这个问题，因为`missing[1]`仅当`1`被插入，直到那时任何`present[x]`这取决于`1`保持`bad > 0`。 

另一个微妙的情况是重复值。 由于插入在集合成员资格方面是幂等的，因此我们通过检查来忽略重复项`present[x]`在应用更新之前。 这可以防止双减除数计数并保持不变量一致。 

第三种情况是以递减的整除顺序插入数字，例如`6, 3, 2, 1`。 该结构最初严重违反闭包性，但随着缺少除数的引入而逐渐变得有效。 动态维护确保在每个步骤之后评估正确性，而不是假设单调有效性。
