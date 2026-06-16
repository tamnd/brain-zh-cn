---
title: "CF 1005A - Tanya and Stairways"
description: "我们得到一个整数序列，代表 Tanya 在建筑物中爬楼梯时所说的话。 每次她开始一个新的楼梯时，她总是从 1 开始计数，每走一步就加 1，直到到达该楼梯的最后一步。"
date: "2026-06-16T23:20:36+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1005
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 496 (Div. 3)"
rating: 800
weight: 1005
solve_time_s: 181
verified: true
draft: false
---

[CF 1005A - 坦尼娅和楼梯](https://codeforces.com/problemset/problem/1005/A)

 **评分：** 800
 **标签：** 实施
 **求解时间：** 3m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数序列，代表 Tanya 在建筑物中爬楼梯时所说的话。 每次她开始一个新的楼梯时，她总是从 1 开始计数，每走一步就加 1，直到到达该楼梯的最后一步。 

So the sequence is not arbitrary. It is formed by concatenating several consecutive segments, where each segment is a prefix of the natural numbers starting at 1 and ending at some value x. Our task is to split the sequence back into those segments and report how many segments there are and the length of each segment.

 The input size is at most 1000 numbers. This immediately tells us that any solution that scans the array a constant number of times or even nested linear scans is easily fast enough. 不需要预处理、散列或高级数据结构。 

The only subtlety lies in correctly identifying where one stairway ends and the next begins. A naive mistake is to assume that every time the sequence value decreases, or every time we see a 1, we start a new segment without carefully handling boundaries. For example, in a sequence like`1 2 3 1 2 3 4`, the restart at 1 is obvious, but in more general sequences, the break always happens exactly when the sequence stops being consecutive increasing-by-one starting from 1.

 典型的错误方法是仅检查`a[i] == 1`as a boundary marker. This works here because the problem guarantees validity, but a careless implementation might miss that the last element of a segment is not necessarily followed by 1; 相反，当下一个值为 1 或到达数组末尾时，该段结束。 

正确的解释是每个楼梯都是最大连续段，其中值恰好是`1, 2, 3, ..., k`。 

## 方法

 考虑这个问题的一种强力方法是尝试将序列的每一个可能的分区划分为有效的楼梯并验证每个分区。 At each potential cut position, we would check whether the segment from that start index forms a valid sequence starting from 1 and increasing by 1. In the worst case, we might repeatedly re-scan parts of the array for validation, leading to quadratic or even cubic behavior depending on how the checks are structured. 虽然这仍然在 n 达到 1000 的限制范围内，但它是不必要的，并且从概念上讲比需要的更重。 

关键的观察是我们不需要猜测片段的结束位置。 当当前值等于到目前为止段的长度时，段必须恰好结束，因为有效的楼梯总是看起来像`1, 2, ..., length`。 So we can greedily extend a segment until we have just seen the number equal to the current segment size, then close it.

 This reduces the problem to a single linear pass, maintaining the current expected next value in the segment.

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | Brute Force Partition Checking | O(n²) | O(n) | Too slow / unnecessary |
 | Greedy single pass | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. Start scanning the array from left to right, treating each new segment as a fresh stairway.

 We know every stairway must begin with 1, so we expect the first element of any segment to be 1.
2. When we begin a new segment, set a counter`expected = 1`并记录该段已开始。 
3. Move forward in the array, checking each value.

 If the current value matches`expected`，我们仍然在有效的楼梯内，所以我们增加`expected`1.
 4. If at any point we reach a position where`expected`完成一段后再次变为1，表示新楼梯的开始。 
5. 当我们消耗完从 1 到某个 k 的完整前缀时，段正好结束，这对应于我们即将开始新的 1 或到达数组末尾的时刻。 
6. 完成后存储每个段的长度。 

### 为什么它有效

 每个有效的楼梯由其起点唯一确定，并且必须严格遵循从 1 开始递增的连续整数。因为保证输入有效，所以分段不会有歧义：一旦我们看到 1，就必须开始一个新的分段，并且在两个连续的 1 之间，序列必须形成连续递增的运行。 这种结构确保贪婪分割永远不需要回溯或猜测，因为任何与递增一的偏差都会与有效性相矛盾。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))

segments = []
i = 0

while i < n:
    expected = 1
    length = 0
    
    while i < n and a[i] == expected:
        length += 1
        expected += 1
        i += 1
    
    segments.append(length)

print(len(segments))
print(*segments)
```The code scans the array once. 外层循环在楼梯之间前进，内层循环通过匹配从 1 开始的递增序列，恰好消耗了一个有效楼梯。`expected`变量强制执行有效楼梯的结构，并且`length`records how many steps it contained.

 A subtle point is that we never explicitly search for the next 1. Instead, the inner loop naturally stops when the sequence breaks, which can only happen at the boundary between stairways because the input is guaranteed valid.

 ## 工作示例

 ### 示例 1

 输入：```
7
1 2 3 1 2 3 4
```| 我| 一个[我] | 预计| 长度| 片段结束 |
 | --- | --- | --- | --- | --- |
 | 0 | 1 | 1 | 1 | 没有|
 | 1 | 2 | 2 | 2 | 没有|
 | 2 | 3 | 3 | 3 | 是的 |
 | 3 | 1 | 1 | 1 | 没有|
 | 4 | 2 | 2 | 2 | 没有|
 | 5 | 3 | 3 | 3 | 没有|
 | 6 | 4 | 4 | 4 | 是的 |

 We obtain two segments of lengths 3 and 4. The trace shows that each time`expected`完成一次完整的运行后，楼梯恰好在该点结束。 

### 示例 2

 输入：```
5
1 2 1 1 2
```| 我| 一个[我] | 预计| 长度| 片段结束 |
 | --- | --- | --- | --- | --- |
 | 0 | 1 | 1 | 1 | 没有|
 | 1 | 2 | 2 | 2 | 是的 |
 | 2 | 1 | 1 | 1 | 是的 |
 | 3 | 1 | 1 | 1 | 没有|
 | 4 | 2 | 2 | 2 | 是的 |

 输出是`3`具有长度的线段`2 1 2`。 

此跟踪突出显示，当序列立即重新启动时，单元素楼梯是有效的并正确处理。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 作为段扫描的一部分，每个元素都被访问一次 |
 | 空间| O(1) | O(1) | 仅使用计数器和一小部分段长度 |

 输入大小最多为1000，因此线性扫描远低于时间限制。 除了输出存储之外，内存使用量是恒定的，这是不可避免的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    n = int(input())
    a = list(map(int, input().split()))

    segments = []
    i = 0

    while i < n:
        expected = 1
        length = 0
        while i < n and a[i] == expected:
            length += 1
            expected += 1
            i += 1
        segments.append(length)

    return str(len(segments)) + "\n" + " ".join(map(str, segments))

# provided sample
assert run("7\n1 2 3 1 2 3 4\n") == "2\n3 4"

# single stairway
assert run("3\n1 2 3\n") == "1\n3"

# multiple single-step stairways
assert run("3\n1 1 1\n") == "3\n1 1 1"

# alternating short stairs
assert run("5\n1 2 1 2 3\n") == "2\n2 3"

# maximum length single staircase
assert run("1\n1\n") == "1\n1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 2 3 | 1 2 3 1 / 3 | 1 / 3 单层全楼梯|
 | 1 1 1 | 1 1 1 3 / 1 1 1 | 连续重启 |
 | 1 2 1 2 3 | 1 2 1 2 3 2 / 2 3 | 2 / 2 3 混合分割 |
 | 1 | 1 / 1 | 1 / 1 最小尺寸|

 ## 边缘情况

 一种边缘情况是整个序列由多个长度为 1 的独立楼梯组成，例如`1 1 1 1`。 该算法在每个`1`, immediately matches `expected = 1`，消耗单个元素，并关闭该段。 这会产生四个长度为 1 的段，与预期的解释相匹配。 

Another edge case is a single long stairway like`1 2 3 4 5`。 在这里，内循环永远不会提前中断，`expected`平滑增加直至结束，并且恰好以正确的全长记录了一个片段。
