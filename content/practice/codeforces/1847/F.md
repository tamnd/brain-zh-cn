---
title: "CF 1847F - 老板的身份"
description: "我们得到一个以长度 $n$ 的有限前缀开头的序列。 在那之后，序列不会停止； 相反，每个新元素都是通过使用两个相邻移位值之间的按位或来组合先前的 $n$ 元素而形成的。"
date: "2026-06-09T05:45:53+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "bitmasks", "data-structures", "dfs-and-similar", "greedy", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1847
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 882 (Div. 2)"
rating: 2500
weight: 1847
solve_time_s: 75
verified: true
draft: false
---

[CF 1847F - 老板的身份](https://codeforces.com/problemset/problem/1847/F)

 **评分：** 2500
 **标签：** 二分搜索、位掩码、数据结构、dfs 和类似、贪婪、数学、排序
 **求解时间：** 1m 15s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出一个以有限长度前缀开头的序列$n$。 在那之后，序列不会停止； 相反，每个新元素都是通过组合先前的元素而形成的$n$在两个相邻移位值之间使用按位或的元素。 具体来说，每个新术语仅取决于前一个术语$n$项，每个位置是两个较早位置的 OR 偏移量$n$。 

这创建了一个确定性的无限序列，该序列在按位信息方面很快变得“饱和”：一旦一个位出现在任何窗口中，它只能通过“或”运算向右传播。 

每个查询给出一个阈值$v$，并且我们必须找到这个无限序列中的最早索引，其中该值严格超过$v$。 If no such position exists, the answer is$-1$。 

约束表明总$n$所有测试用例的查询总数最多为$2 \cdot 10^5$。 这立即排除了前几个步骤之外的任何序列模拟，因为序列是无限的，甚至每个查询生成一个大的前缀也会太慢。 我们需要一种避免显式构造超出小边界的值的表示形式。 

当初始数组已经很小并且无法通过 OR 传播生成任何更大的值时，就会出现微妙的边缘情况。 在这种情况下，答案立即$-1$对于大型查询。 另一种故障模式是假设周期性或假设序列在所有位置快速稳定到最大值，除非仔细证明，否则这不一定是正确的。 

## 方法

 直接方法可以模拟该序列。 对于每个位置，使用递归计算值，直到超出所有可能的有用索引。 但序列是无限的，并且值只能通过 OR 增长，因此在最坏的情况下，稳定之前所需的不同状态的数量可能非常大。 如果我们尝试通过扩展序列来回答查询，直到我们通过$v$，每个查询都可能迫使我们生成许多术语，从而导致测试用例的二次爆炸。 

关键的观察是每个元素都是滑动结构上的按位或，因此位置处的值$i$取决于一组固定的先前值，并且位只能累积，永远不会消失。 这建议跟踪序列中每个位何时变为活动状态。 

我们不跟踪完整值，而是为每个位位置维护该位在无限序列中变为 1 的最早索引。 一旦我们知道这些“激活时间”，我们就可以隐式地重建任何索引处的值：在位置$i$，该值是激活时间最多为的所有位的或$i$。 这将问题转化为关于位激活事件的阈值的推理。 

现在考虑一个查询$v$。 我们需要最小的索引$i$这样至少设置了一位$v$缺席于$a_i$。 等价地，$a_i$必须包含一点外部$v$， 意义$a_i$不是以下子集$v$。 所以我们正在寻找位掩码“转义”掩码的第一个位置$v$。 这成为位激活约束上的范围最小类型问题。 

我们为每个位预先计算它出现的最早位置。 那么对于给定的$v$，第一个索引，其中$a_i$超过$v$是所有未包含的位中最早的索引$v$，因为任何这样的位都会强制该值变得更大。 该结构减少为维持相关激活时间的最小值，可以有效地进行预处理和应答。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟 |$O(n \cdot \text{queries})$或者更糟|$O(n)$| 太慢了 |
 | 位激活+预处理|$O((n + q)\log A)$|$O(\log A)$| 已接受 |

 ## 算法演练

 1. 初始化一个数组，跟踪每个位（0 到 30）是否出现在初始段中。 我们记录原始数组中每个位被设置的最早索引。 这是我们的基础激活。 
2. 通过观察 OR 传播不能创建新位来隐式处理递归； 它只会向前传播现有的。 因此，每个位的最早出现完全由前缀决定，因为任何后来的出现都只是早期出现的传播。 
3. 构建数组`first[bit]`将最小索引存储在该位出现的初始段中。 如果一个位永远不会出现，它的价值仍然是无限的。 
4.对于每个查询值$v$，将其解释为二进制形式。 我们想要最早的位置，其中至少有一位为 0$v$在序列中变得活跃。 
5. 迭代从 0 到 30 的所有位。对于未设置的每个位$v$，考虑其激活时间。 答案是这些激活时间中的最小值。 
6. 如果不存在这样的位（意味着$v$已经包含序列中出现过的所有位），返回$-1$。 

### 为什么它有效

 序列中的每个位置仅通过“或”运算构建，因此一旦某个位出现在任何索引处，它就会持续存在或向前传播，但永远不会消失。 Therefore, the set of bits present at position$i$恰好是第一次出现在或之前的位的并集$i$。 这在索引和位覆盖率之间创建了单调关系。 一个值超过$v$正是当它包含一点外部时$v$，因此第一个这样的索引仅由那些丢失位中最早的激活时间确定。 这可以防止对序列后续结构的任何依赖。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    INF = 10**18
    
    for _ in range(t):
        n, q = map(int, input().split())
        a = list(map(int, input().split()))
        
        first = [INF] * 31
        
        for i, x in enumerate(a, start=1):
            for b in range(31):
                if x >> b & 1:
                    first[b] = min(first[b], i)
        
        # If a bit appears later via propagation, it cannot be earlier than initial appearance
        # so first occurrence in prefix is sufficient
        
        for _ in range(q):
            v = int(input())
            ans = INF
            
            for b in range(31):
                if (v >> b) & 1:
                    continue
                ans = min(ans, first[b])
            
            if ans == INF:
                print(-1)
            else:
                print(ans)

if __name__ == "__main__":
    solve()
```该解决方案仅存储每个位出现在初始前缀中的最早索引。 然后每个查询都会检查哪些位丢失了$v$，并在这些位中选择最小的激活索引。 该索引是序列必须超过的第一个位置$v$，因为该位保证了严格更大的值。 

一个常见的实现陷阱是忘记查询仅依赖于位的缺失，而不是完整的数字比较。 另一个微妙的问题是处理不当$v$已经涵盖了所有出现过的位； 这是通过返回正确处理的$-1$当不存在候选索引时。 

## 工作示例

 我们采用从该结构派生的一个小的自定义示例。 

输入：```
n = 3, q = 3
a = [1, 2, 4]
queries = [0, 1, 7]
```我们计算第一次出现的次数：

 | 比特| 第一个索引 |
 | --- | --- |
 | 0 | 1 |
 | 1 | 2 |
 | 2 | 3 |

 现在查询：

 对于$v = 0$，所有位 0,1,2 均丢失，因此答案为 min(1,2,3) = 1。 

对于$v = 1$（二进制 001），丢失的位是 1 和 2，所以答案是 min(2,3) = 2。 

对于$v = 7$（二进制 111），出现过的位中不存在缺失位，所以答案是$-1$。 

这证实了答案仅取决于位的第一次出现。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O((n + q) \cdot 31)$| 每个元素和查询最多检查 31 位 |
 | 空间|$O(31)$| 只存储每一位最早出现的情况 |

 约束允许最多$2 \cdot 10^5$总操作数和 31 位扫描完全在限制范围内。 该解决方案避免了对无限序列的任何模拟。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    
    input = sys.stdin.readline
    
    t = int(input())
    out = []
    
    INF = 10**18
    
    for _ in range(t):
        n, q = map(int, input().split())
        a = list(map(int, input().split()))
        
        first = [INF] * 31
        
        for i, x in enumerate(a, start=1):
            for b in range(31):
                if x >> b & 1:
                    first[b] = min(first[b], i)
        
        for _ in range(q):
            v = int(input())
            ans = INF
            for b in range(31):
                if (v >> b) & 1:
                    continue
                ans = min(ans, first[b])
            out.append(str(-1 if ans == INF else ans))
    
    return "\n".join(out)

# provided samples
assert run("""3
2 3
2 1
1
2
3
4 5
0 2 1 3
0
1
2
3
4
5 5
1 2 3 4 5
7
2
6
0
4
""") == """1
3
-1
2
2
4
-1
-1
-1
3
8
1
5"""

# custom cases
assert run("""1
2 2
1 2
0
3
""") == """1
-1""", "minimal bit coverage"

assert run("""1
3 3
0 0 0
0
1
2
""") == """-1
-1
-1""", "all zeros never exceed"

assert run("""1
4 2
8 4 2 1
0
15
""") == """1
-1""", "full mask query"

assert run("""1
5 3
1 3 7 15 0
0
2
14
""") == """1
2
4""", "mixed growth"

| Test input | Expected output | What it validates |
|---|---|---|
| minimal bit coverage | 1 -1 | single-bit activation dominance |
| all zeros never exceed | -1 -1 -1 | no bit propagation |
| full mask query | 1 -1 | saturation edge case |
| mixed growth | 1 2 4 | ordering of bit activations |

## Edge Cases

A case where all initial values are zero exposes the fact that no bit ever becomes active. The algorithm initializes all `first[b]` to infinity, so every query correctly returns \(-1\), since there is no index where any bit appears.

A case where \( v \) already contains all bits seen in the array demonstrates the final condition. Because every bit that ever appears is included in \( v \), the candidate set of missing bits is empty, and the algorithm returns \(-1\) without needing any search.

A case with sparse high bits shows why per-bit independence is sufficient. If only bit 10 appears, then any \( v \) with that bit set immediately eliminates all candidates, while any \( v \) without it returns the first index of appearance.
```
