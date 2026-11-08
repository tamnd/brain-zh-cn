---
title: "CF 2036A - 疯狂狂热"
description: "这里的旋律只是整数音高的短序列。 每个音高都是 0 到 127 之间的整数，重要的不是绝对值，而是相邻音符之间的差异。"
date: "2026-06-08T10:19:06+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 2036
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 984 (Div. 3)"
rating: 800
weight: 2036
solve_time_s: 61
verified: true
draft: false
---

[CF 2036A - Quintomania](https://codeforces.com/problemset/problem/2036/A)

 **评分：** 800
 **标签：** 实施
 **求解时间：** 1m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 这里的旋律只是整数音高的短序列。 每个音高都是 0 到 127 之间的整数，重要的不是绝对值，而是相邻音符之间的差异。 

We are asked to check a simple structural property: for every adjacent pair in the sequence, the absolute difference of their values must be either 5 or 7. If every transition in the melody respects this rule, the melody is considered valid, otherwise it is rejected.

 每个测试用例都是独立的，因此任务是对多个小数组进行重复检查。 每个旋律的大小都很小，最多 50 个音符，最多有 1000 个测试用例，因此即使是简单的每对检查也很快。 

不存在隐藏的转换或全局约束。 唯一的微妙之处是记住条件是绝对差，而不是有符号差。 像 10 到 17 和 17 到 10 这样的转换都是有效的，因为两者都会产生差值 7。 

简单实现中的一个典型错误是忘记绝对值或仅检查差异的一个方向。 当有人不小心检查连续音符的相等而不是它们的差异时，就会出现另一个问题。 

边缘情况大多是最小长度。 如果一首旋律正好有 2 个音符，我们只检查一个音程。 例如，输入`[1, 6]`有效，因为差值为 5，而`[1, 7]`无效，因为差值是 6，这是不允许的。 

## 方法

 蛮力方法几乎与定义相同。 对于每个旋律，迭代所有相邻对并验证每个差异是 5 还是 7。如果任何对违反条件，我们立即拒绝该旋律。 

由于每个旋律最多有 50 个音符，因此该方法对每个测试用例最多执行 49 次比较，最多执行 1000 个测试用例，最坏情况下约为 50,000 次操作。 这已经是微不足道的事情了，所以不需要高级优化。 

这里没有隐藏真正的算法技巧。 关键的观察结果很简单，条件是局部的：每个约束仅涉及两个连续的元素，因此整个问题简化为单遍验证。 除了共享端点之外，不同对之间不存在依赖关系，因此不需要动态编程或预处理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(t·n) | O(1) | O(1) | 已接受 |
 | 最佳 | O(t·n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 我们独立处理每个旋律并一次性验证它。 

1.读取测试用例的数量。 每个测试用例描述一种旋律。 
2. 对于每个旋律，读取音符数和整数列表。 
3. 从第二个音符迭代到最后一个音符。 
4. 对于每个索引 i，计算 a[i] 和 a[i−1] 之间的绝对差。 无论方向如何，这都会捕获连续音符之间的间隔。 
5. 检查这个差异是否正好是5或正好7。如果不是，立即断定该旋律无效。 
6. 如果循环结束时没有发现违规，则旋律满足所有约束并且有效。 

关键的设计选择是失败时尽早退出。 一旦发现单个无效间隔，就无需继续扫描序列的其余部分，因为一次违规就足以使整个旋律无效。 

### 为什么它有效

 问题中的每个要求对于相邻对来说都是独立的和局部的。 当且仅当满足所有局部约束时，旋律才有效。 该算法直接将每个约束强制执行一次。 由于没有步骤修改序列或取决于未来的决策，因此无法错误地拒绝有效序列或接受无效序列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))

    ok = True
    for i in range(1, n):
        diff = abs(a[i] - a[i - 1])
        if diff != 5 and diff != 7:
            ok = False
            break

    print("YES" if ok else "NO")
```该解决方案的结构是简单的流式验证。 每个测试用例都是独立处理的，我们避免存储当前数组之外的任何内容。 

The critical implementation detail is using`abs(a[i] - a[i - 1])`。 如果没有绝对值，负差将根据符号错误地通过或失败。 另一个重要的细节是早期`break`，这确保我们一旦发现违规行为就立即停止。 

## 工作示例

 ### 示例 1

 输入：```
3
3
76 83 88
3
10 15 22
4
1 6 1 6
```| 我| 配对| 差异| 至今有效 |
 | --- | --- | --- | --- |
 | 1 | 76,83 | 76,83 7 | 是 |
 | 2 | 83,88 | 5 | 是 |

 结果：是

 | 我| 配对| 差异| 至今有效 |
 | --- | --- | --- | --- |
 | 1 | 10,15 | 10,15 5 | 是 |
 | 2 | 15,22 | 15,22 7 | 是 |

 结果：是

 | 我| 配对| 差异| 至今有效|
 | --- | --- | --- | --- |
 | 1 | 1,6 | 5 | 是 |
 | 2 | 6,1 | 5 | 是 |
 | 3 | 1,6 | 5 | 是 |

 结果：是

 前两个示例确认了标准的向前和混合过渡，而第三个示例表明，只要每个步骤遵循允许的距离，交替的前后移动仍然有效。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(Σn) | 每个测试用例扫描一次其旋律 |
 | 空间| O(1) | O(1) | 除了输入存储之外只有几个变量 |

 The total number of elements across all test cases is small enough that a single linear scan per case easily fits within time limits.

 ## 测试用例```python
import sys, io

def solve():
    import sys
    input = sys.stdin.readline

    t = int(input())
    out = []
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))

        ok = True
        for i in range(1, n):
            d = abs(a[i] - a[i - 1])
            if d != 5 and d != 7:
                ok = False
                break

        out.append("YES" if ok else "NO")

    print("\n".join(out))

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    import io as _io
    buf = _io.StringIO()
    with redirect_stdout(buf):
        solve()
    return buf.getvalue().strip()

# provided samples
assert run("""8
2
114 109
2
17 10
3
76 83 88
8
38 45 38 80 85 92 99 106
5
63 58 65 58 65
8
117 124 48 53 48 43 54 49
5
95 102 107 114 121
10
72 77 82 75 70 75 68 75 68 75
""") == """YES
YES
YES
NO
YES
NO
YES
YES"""

# minimum length valid
assert run("""1
2
0 5
""") == "YES"

# minimum length invalid
assert run("""1
2
0 6
""") == "NO"

# alternating valid pattern
assert run("""1
4
0 5 0 5
""") == "YES"

# single violation in middle
assert run("""1
5
0 5 10 18 23
""") == "NO"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2→5→0→5 | 是 | 交替有效步骤|
 | 0→6 | 否 | 单个无效边|
 | 0→5→10→18→23 | 否 | 中序违规传播|

 ## 边缘情况

 一种边缘情况是尽可能最小的旋律长度，n = 2。例如，输入`0 5`应该返回 YES，因为只有一个间隔并且它符合规则。 该算法可以正确处理此问题，因为循环运行一次并验证该单一差异。 

另一种情况是交替方向但保持有效步长的序列，例如`0 5 0 5`。 差异为 5、5 和 5，全部有效，因此旋律通过。 该算法自然支持这一点，因为它不假设单调运动。 

失败情况是中间出现单个无效转换。 例如`0 5 10 18`具有差异 5、5 和 8。在从 10 到 18 的步骤中，差异为 8，这会立即触发拒绝。 提前退出可确保我们不会错误地继续并忽略违规行为。
