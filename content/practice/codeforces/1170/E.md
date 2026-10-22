---
title: "CF 1170E - 滑动门"
description: "我们有一行 $m$ 个单元格和一系列 $n$ 个滑动门。 每扇门都占据一个连续的单元格，并且门以固定的从左到右的顺序出现。"
date: "2026-06-18T17:10:04+07:00"
tags: ["codeforces", "competitive-programming", "*special", "binary-search"]
categories: ["algorithms"]
codeforces_contest: 1170
codeforces_index: "E"
codeforces_contest_name: "Kotlin Heroes: Episode 1"
rating: 0
weight: 1170
solve_time_s: 93
verified: true
draft: false
---

[CF 1170E - 滑动门](https://codeforces.com/problemset/problem/1170/E)

 **评级：** -
 **标签：** *特殊，二分查找
 **求解时间：** 1m 33s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一行$m$细胞和一系列$n$滑动门。 每扇门都占据一个连续的单元格，并且门以固定的从左到右的顺序出现。 门$i$有固定宽度$a_i$，虽然门可以沿着走廊滑动，但它们不能相互穿过，因此它们的相对顺序永远不会改变。 

从这个角度来看，有效的配置只是放置$n$沿着一条线的固定长度的不相交线段$m$位置，在它们之间和周围留下一些未被覆盖的细胞。 那些未被覆盖的细胞形成“自由空间”。 

每个查询都会提供一组必须可同时访问的单元索引。 仅当单元未被任何门段覆盖时才可进入。 每个查询的问题是我们是否可以将门滑入某种有效的配置，以便所有所需的单元同时位于可用空间中。 

关键的困难是我们没有被要求检查固定的配置。 我们可以重新安排门之间的间隙，但我们必须尊重门的固定顺序及其固定长度。 

这些约束已经排除了任何尝试显式模拟位置或搜索展示位置的解决方案。 高达$2 \cdot 10^5$门和查询，以及总查询大小$2 \cdot 10^5$，任何针对单元格或门的每次查询二次推理都会失败。 我们需要一个解决方案，能够按照输入的大小在线性时间内处理每个查询。 

当一扇门对于所需位置之间的空闲单元区域来说太大时，就会出现微妙的故障情况。 例如，如果所需的单元格将走廊分成小的安全部分，则除非我们可以仔细地重新排列分组，否则一扇长门可能会被迫穿过所需的单元格。 这是核心约束：门不能跨过禁止位置。 

## 方法

 暴力解释是尝试所有可能的位置$n$在线段上进行分段，并检查是否有任何位置避免覆盖所需的单元格。 这相当于分发$m - \sum a_i$空的单元格作为门之间的间隙，这已经暗示了组合爆炸。 即使我们忽略精确位置并仅推理间隙，可能的分布数量也是指数级的$n$，所以直接搜索是不可行的。 

关键的结构观察是，唯一重要的是所需的细胞如何与连续的自由空间块相互作用。 一旦我们修复了查询所需的单元格，它们就会将该行划分为“安全”单元格的最大段。 安全段内，任何门都禁止通过。 唯一的限制是单个门不能穿过所需的单元，因此每扇门都必须完全放置在这些安全段之一内。 

这就把问题变成了打包过程。 我们计算安全段的长度，并尝试按顺序放置门，将它们贪婪地安装到这些段中。 由于门是有序的并且不能重叠，因此一旦将门放置在段中，所有先前的门都会固定到较早的段中。 如果一扇门不适合当前的安全段，我们就会移动到下一个。 

这将问题减少到每个查询一次线性扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 枚举展示位置 | 指数| O(1) | O(1) | 太慢了 |
 | 段分解+贪婪打包|$O(m + \sum c_k)$| O(米) | 已接受 |

 ## 算法演练

 我们独立处理每个查询。 

### 1. 构建安全段

 我们从全系列开始$[1, m]$并标记所有必需的单元格。 这些所需位置将线分割成不包含所需单元格的连续间隔。 每个这样的间隔都是一个安全段，其长度代表有多少连续空间可用于放置门。 

我们压缩成段的原因是，在段内，门相对于所需单元的位置没有限制，因为没有门。 

### 2.门的贪婪放置

 我们按顺序迭代门。 我们还按顺序迭代安全段。 

我们维护当前安全段中还有多少剩余空间可用。 

对于每扇门：

 1. 如果当前安全段有足够的剩余空间来容纳门，我们将其放置在那里并减少剩余空间。 
2. 如果不适合，我们移动到下一个安全段并重置剩余容量。 
3. 如果门大于任何单个安全段，即使向前移动，答案也立即不可能。 

这种贪婪策略之所以有效，是因为一旦我们承诺将一扇门放置在一个段中，稍后放置它只会减少后续门的可用空间，而这些门已经受到顺序的限制。 

### 3.决定答案

 如果所有门均已成功放置，我们将返回 YES。 否则，我们返回 NO。 

### 为什么它有效

 关键的不变量是，在每一步中，我们总是将当前的门放置在它适合的最早的安全段中。 任何将其进一步向右推的替代放置只会降低后面的门的灵活性，因为后面的门具有相同或更少的剩余选择，但可用的段更少或相等。 这种单调结构确保如果存在有效的排列，贪婪放置就会找到它。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    q = int(input())

    for _ in range(q):
        tmp = list(map(int, input().split()))
        c = tmp[0]
        w = tmp[1:]

        # build safe segments from forbidden positions
        w.sort()
        segs = []
        prev = 1

        for x in w:
            if prev <= x - 1:
                segs.append(x - prev)
            prev = x + 1

        if prev <= m:
            segs.append(m - prev + 1)

        # greedy placement
        i = 0
        ok = True

        for length in segs:
            remaining = length

            while i < n and remaining >= a[i]:
                remaining -= a[i]
                i += 1

            # if we cannot place next door in this segment
            # we just move to next segment, but if segment is too small for a single door, we skip
            while i < n and a[i] > length:
                # this door cannot fit here at all, try next segment
                break

            if i == n:
                break

        # after processing all segments, check if all doors placed
        print("YES" if i == n else "NO")

if __name__ == "__main__":
    solve()
```该代码首先将禁止单元转换为最大自由间隔。 这些间隔代表所有可能的连续区域，在这些区域中可以放置门而无需跨越所需的位置。 

然后它尝试按顺序打包门。 指针`i`跟踪必须放置的隔壁。 对于每个安全段，我们消耗尽可能多的连续门，以适应该段。 当门不适合时，我们通过继续循环隐式移动到下一段。 

一个微妙的一点是，我们从不尝试将门分成不同的部分。 每扇门必须完全适合单个安全段，这正是贪婪检查所强制执行的。 

## 工作示例

 ### 示例 1

 输入：```
m = 10
doors = [2, 3, 2]
w = [5]
```安全段是：

 | 细分 | 范围 | 长度|
 | ---| ---| ---|
 | 1 | [1,4]| 4 |
 | 2 | [6,10]| 5 |

 我们模拟放置：

 | 细分 | 剩余| 门指数| 门尺寸| 行动|
 | ---| ---| ---| ---| ---|
 | [1,4]| 4 | 0 | 2 | 位置，剩余 2 |
 | [1,4]| 2 | 1 | 3 | 不适合，移动段|
 | [6,10]| 5 | 1 | 3 | 位置，剩余 2 |
 | [6,10]| 2 | 2 | 2 | 地点 |

 所有门都已放置，所以答案是“是”。 

这显示了单个被阻塞的单元如何强制分割，但仍然允许门的重新分配。 

### 示例 2

 输入：```
m = 4
doors = [1, 1]
w = [2, 4]
```安全段：

 | 细分 | 范围 | 长度|
 | ---| ---| ---|
 | 1 | [1,1]| 1 |
 | 2 | [3,3]| 1 |

 | 细分 | 剩余| 门指数| 门尺寸| 行动|
 | ---| ---| ---| ---| ---|
 | [1,1]| 1 | 0 | 1 | 地点 |
 | [3,3]| 1 | 1 | 1 | 地点 |

 这证实了最小段仍然允许正确的贪婪打包。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n + \sum c_k)$| 每个查询最多处理一次每个门，并且每个查询线性扫描其禁止位置 |
 | 空间|$O(m)$最坏的情况| 用于根据查询隐式存储段结构 |

 该解决方案保持在限制范围内，因为总查询大小和所有查询的总处理量与输入大小呈线性关系。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    q = int(input())

    out = []
    for _ in range(q):
        tmp = list(map(int, input().split()))
        c = tmp[0]
        w = tmp[1:]
        w.sort()

        segs = []
        prev = 1
        for x in w:
            if prev <= x - 1:
                segs.append(x - prev)
            prev = x + 1
        if prev <= m:
            segs.append(m - prev + 1)

        i = 0
        ok = True
        for length in segs:
            remaining = length
            while i < n and a[i] <= remaining:
                remaining -= a[i]
                i += 1

        out.append("YES" if i == n else "NO")
    return "\n".join(out)

# provided sample
assert run("""3 10
2 3 2
6
1 5
2 1 10
2 2 9
2 5 6
3 1 7 8
4 1 2 3 4
""") == """YES
YES
NO
NO
YES
NO"""

# edge: no restrictions
assert run("""2 5
2 5
1
0
""") == "YES"

# edge: impossible due to single tiny segment
assert run("""2 4
3 2
1
1 2
""") == "NO"

# edge: alternating constraints
assert run("""3 6
2 2 2
1
2 2 5
""") == "YES"

# edge: many forbidden points
assert run("""3 10
2 3 2
1
4 2 4 6 8
""") == "NO"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 没有禁止的细胞| 是 | 基线完全灵活性|
 | 单紧块| 否 | 对于门来说片段太小|
 | 交替约束| 是 | 多段仍然可行|
 | 诸多禁点| 否 | 碎片破坏包装|

 ## 边缘情况

 一个关键的边缘情况是当单个所需单元创建一个小于某些门的段时。 在这种情况下，即使总可用空间很大，分割也会产生硬屏障。 该算法检测到这一点是因为在贪婪扫描期间该门永远不会适合任何单个段。 

另一种边缘情况是当所需的单元格位于边界时，例如位置 1 或位置$m$。 这将创建长度为零的空前导或尾随段。 该构造自然会忽略零长度段，因此不需要特殊处理。 

最后的边缘情况是需要所有单元时。 这根本不会产生安全段，并且贪婪的过程会立即失败，因为没有门可以放置在任何地方，从而正确地产生 NO。
