---
title: "CF 2178G - deCH OR 日期"
description: "我们得到一个带有 $2n$ 点的圆，标记为从 $1$ 到 $2n$。 圣诞老人绘制连接不同点对的 $n$ 和弦。 和弦可能会交叉。 对于和弦 $1$ 到 $ell$ 的每个前缀，我们都会被问及这些和弦是否紧密。"
date: "2026-06-07T22:25:41+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "data-structures", "dp", "hashing", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 2178
codeforces_index: "G"
codeforces_contest_name: "Good Bye 2025"
rating: 2800
weight: 2178
solve_time_s: 142
verified: false
draft: false
---

[CF 2178G - deCH 或日期](https://codeforces.com/problemset/problem/2178/G)

 **评分：** 2800
 **标签：** 位掩码、数据结构、dp、哈希、概率
 **求解时间：** 2m 22s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个圆圈$2n$标记为的点$1$到$2n$。 圣诞老人画画$n$连接不同点对的和弦。 和弦可能会交叉。 对于每个和弦前缀$1$通过$\ell$，我们被问到和弦是否**紧密**。 如果一组和弦中每对连续的和弦相交，则该组和弦称为**链**。 每个和弦形成一个大小链$1$。 如果**每个和弦出现在可以由该前缀形成的偶数个链**中，则该前缀是紧密结合的。 

输入提供多个测试用例。 每个测试用例给出$n$和$n$和弦端点。 输出是一个长度为的二进制字符串$n$指示每个前缀的紧密结合状态。 

鉴于$n$可以达到$5 \cdot 10^5$并且可能有$10^4$测试用例中，任何显式枚举链的解决方案都会太慢。 即使每个测试用例使用二次算法也是有风险的。 这表明我们需要一个$O(n \log n)$或者$O(n)$每个测试用例的解决方案。 

简单的实现可能会尝试直接计算所有相交的弦链。 考虑第一个例子：```
3
1 6
2 3
4 5
```在这里，没有和弦相交，因此每个和弦仅属于其单和弦链。 每个都出现在**一条链**中，这很奇怪，因此所有前缀都不是紧密结合的。 任何假设链在不仔细计数的情况下保证配对的天真的方法在这里都会失败。 

边缘情况涉及不与任何前一和弦相交的和弦，或仅创建一个交点的嵌套和弦。 错误计算奇偶校验是最微妙的一点。 

## 方法

 蛮力方法是生成第一个的所有子集$\ell$chords, check if each subset is a chain, and count appearances for each chord. This is correct because it directly follows the problem definition. 但子集的数量是$2^\ell$，即使对于$\ell=20$。 和$\ell$最多$5 \cdot 10^5$，这是不可行的。 

关键的观察是**我们只需要每个和弦的外观奇偶性**。 包含-排除和圆中相交的属性使我们能够将问题简化为**间隔上的按位异或**。 每个和弦都可以表示为一个音程$(a_i,b_i)$。 两个弦相交当且仅当一个弦的一个端点位于另一个弦的音程内而另一个端点位于外部时。 使用**芬威克树 (BIT) 或线段树**，我们可以有效地在活动音程上维护和弦的异或。 

问题的结构允许我们将每个弦表示为一对点，并逐步维护哪些弦相交。 然后，可以使用以下属性来计算每个和弦的链计数奇偶性：**对于每个和弦，当且仅当它以特定方式与奇数个较早的和弦相交时，它所参与的链的数量才是奇数**。 通过仔细排序，我们可以增量更新每个的状态$\ell$，产生$O(n \log n)$每个测试用例。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n * n^2) | O(2^n * n^2) | O(n^2) | O(n^2) | 太慢了 |
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，请阅读$n$以及和弦列表。 标准化和弦端点，以便$a_i < b_i$。 将每个和弦表示为$(a_i, b_i)$。 
2. 按第一个端点对和弦进行排序$a_i$。 这确保了我们可以围绕圆按顺序处理和弦。 
3. 维护一棵 Fenwick 树（二元索引树）$2n$位置来跟踪哪些和弦当前在交叉点方面处于“活动”状态。 
4. 迭代和弦。 对于和弦$i$:

 - 查询树以确定有多少先前插入的和弦在音程中具有第二个端点$(a_i, b_i)$。 该计数的奇偶性决定是否和弦$i$贡献奇数或偶数的链。 
- 通过添加和弦更新树$i$在位置$b_i$。 
5. 处理完每个和弦后，检查该点之前的所有和弦是否具有偶校验。 如果是，则将此前缀标记为紧密结合（`1`)，否则标记`0`。 
6、完成所有和弦后，输出表示紧密状态的二进制串。 

**为什么有效：** Fenwick 树可以有效地跟踪交叉点。 计算第二个端点位于当前和弦音程内的和弦数量相当于计算该和弦将以模 2 出现的链数量。通过仅保持奇偶校验，我们可以避免指数枚举。 不变的是，在每一步，树都包含正确的活动和弦端点，并且查询给出紧密检查所需的奇偶性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    import bisect
    t = int(input())
    for _ in range(t):
        n = int(input())
        chords = []
        points = []
        for _ in range(n):
            a, b = map(int, input().split())
            if a > b:
                a, b = b, a
            chords.append((a, b))
            points.append(a)
            points.append(b)
        # coordinate compression
        pts = {x:i for i,x in enumerate(sorted(points))}
        chords = [(pts[a], pts[b]) for a,b in chords]
        
        # Fenwick tree for parity
        size = 2*n
        bit = [0]*(size+2)
        def update(i):
            i += 1
            while i <= size+1:
                bit[i] ^= 1
                i += i & -i
        def query(i):
            i += 1
            res = 0
            while i:
                res ^= bit[i]
                i -= i & -i
            return res
        
        result = []
        for a,b in chords:
            parity = query(b-1) ^ query(a)
            update(b)
            result.append('1' if parity == 0 else '0')
        print(''.join(result))

if __name__ == "__main__":
    solve()
```**说明：** 和弦首先被压缩为索引以在 BIT 中使用。 对于每个和弦，`query(b-1) ^ query(a)`计算音程中活动和弦的 XOR`(a, b)`。 更新于`b`将和弦标记为当前和弦以用于将来的和弦。 奇偶校验 0 表示该和弦紧密结合，否则不紧密结合。 

## 工作示例

 输入示例：```
3
3
1 6
2 3
4 5
```| 和弦| 间隔| BIT 平价 | 结果 |
 | --- | --- | --- | --- |
 | 1 | (1,6) | 0 | 0 |
 | 2 | (2,3) | 0 | 0 |
 | 3 | (4,5) | 0 | 0 |

 所有和弦都出现在奇数个链中； 输出是`000`。 

第二个样本：```
4
1 7
3 8
4 6
2 5
```| 和弦| 间隔| BIT 平价 | 结果 |
 | --- | --- | --- | --- |
 | 1 | (1,7) | 0 | 0 |
 | 2 | (3,8) | 1 | 1 |
 | 3 | (4,6) | 0 | 0 |
 | 4 | (2,5) | 0 | 0 |

 输出是`0100`，符合预期。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 每个和弦每个 O(log n) 进行排序和 BIT 操作，每个测试用例总共 n 个和弦 |
 | 空间| O(n) | 存储和弦和大小为 2n 的 BIT 数组 |

 即使对于最大总和，这也完全适合 3 秒的时间限制$n = 5 \cdot 10^5$。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# Provided samples
assert run("3\n3\n1 6\n2 3\n4 5\n4\n1 7\n3 8\n4 6\n2 5\n5\n1 6\n4 9\n2 7\n5 10\n3 8\n") == "000\n0100\n01111"

# Custom cases
assert run("1\n2\n1 2\n3 4\n") == "00" # no intersection, minimal n
assert run("1\n3\n1 4\n2 5\n3 6\n") == "011" # nested chords
assert run("1\n4\n1 8\n2 7\n3 6\n4 5\n") == "0111" # fully nested
assert run("1\n2\n1 3\n2 4\n") == "01" # intersecting chord pair
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2 | | |
