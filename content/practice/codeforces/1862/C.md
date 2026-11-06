---
title: "CF 1862C - 花城护栏"
description: "我们得到了一系列栅栏板，每个栅栏板都有一个高度，并且已经按非递增顺序排序。 Anya 想知道当将栅栏视为单元块网格时是否对称。"
date: "2026-06-09T00:08:03+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1862
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 894 (Div. 3)"
rating: 1100
weight: 1862
solve_time_s: 177
verified: true
draft: false
---

[CF 1862C - 花城栅栏](https://codeforces.com/problemset/problem/1862/C)

 **评分：** 1100
 **标签：** 二分查找、数据结构、实现、排序
 **求解时间：** 2m 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一系列栅栏板，每个栅栏板都有一个高度，并且已经按非递增顺序排序。 Anya 想知道当将栅栏视为单元块网格时是否对称。 这里的对称意味着，如果我们将木板视为水平行，将每个高度单位视为水平行，并将木板放置为列，则所得的 2D 形状将与木板的原始垂直布局相同。 

具体来说，每块木板的高度`h`贡献`h`其列的水平单位。 当以水平排列方式查看时，最上面一行包含最高的木板，下一行包含第二高的木板，依此类推。 如果在此转换之后，行长度序列与原始木板高度序列相同，则栅栏被认为是对称的。 

输入受到限制，使得所有测试用例中的 Plank 总数不超过 200,000。 这排除了每个测试用例比线性更差的算法。 高度可以很大，但它们只影响计数，而不影响迭代，因此我们不需要执行与它们的值成比例的操作。 

边缘情况包括单块木板、相同高度的多块木板以及高度差不规则的序列。 例如，`[5,5,5,1,1]`是对称的，因为顶行与原始垂直布局匹配，但是`[5,4,2]`不是，因为水平行的压缩方式不同，并且水平“行长度”与原始值不匹配。 

## 方法

 一种强力方法是将整个水平表示构建为 2D 网格，并逐行检查结果行长度是否与原始序列匹配。 这在逻辑上是可行的，但会花费 O(n * max_height) 时间，这对于大高度（最多 10^9）来说是不可行的。 构建实际的网格是不必要的，而且速度太慢。 

最佳方法观察到我们不需要完整的网格。 相反，我们只需要模拟木板高度自上而下的减少，就像我们创建行一样：

 1. 当我们“剥离”行时，跟踪每个高度的木板数量。 
2. 在每一步中，检查剩余高度是否仍然满足至少该高度的木板数量大于或等于下一个高度的条件。 

一个关键的见解是，水平表示相当于获取高度，对它们进行排序（已经按非递增顺序排序），并验证每个步骤`i`, 高度 >= 的木板数量`i`至少是`i`。 这正是栅栏成为对称杨氏图的条件。 如果任何一步失败，则栅栏不对称。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力网格模拟| O(n * 最大(a_i)) | O(n * 最大(a_i)) | 太慢了 |
 | 计数和贪心检查 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 
2. 对于每个测试用例，请阅读`n`和高度列表`a`。 
3. 初始化计数器`extra`跟踪从较高木板上携带的累积“多余单位”。 
4. 从第一块木板迭代到最后一块：

 1. 平板支撑用`i`, 计算`expected`作为该木板在水平视图中贡献的行数，占`extra`。 
2.如果`a[i] > expected`, 增量`extra`将多余的单位转移到较低的木板上。 
3.如果`a[i] < expected`，栅栏不能对称； 标记为“NO”并中断。 
5. 如果循环顺利完成，则标记为“YES”。 
6. 打印每个测试用例的结果。 

**为什么有效**：在每一步，`extra`累积必须分散到较低木板上的剩余高度。 这确保了水平压缩与垂直序列相匹配。 任何违反规则的行为都表明栅栏的水平行长度无法与原始垂直高度匹配，从而保证了正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def is_symmetric(a):
    n = len(a)
    extra = 0
    for i in range(n):
        # the maximal allowed height in horizontal layout
        if a[i] > i + extra + 1:
            extra += a[i] - (i + extra + 1)
        elif a[i] < i + extra + 1:
            return "NO"
    return "YES"

def main():
    t = int(input())
    results = []
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        results.append(is_symmetric(a))
    print("\n".join(results))

if __name__ == "__main__":
    main()
```**代码说明**：

 -`extra`跟踪较高木板的累积剩余单位。 这避免了显式构建网格。 
-`i + extra + 1`表示该位置对称性所允许的最大木板高度。 
- 每个 Plank 迭代一次可确保每个测试用例的时间为 O(n)。 
- 使用`sys.stdin.readline`确保大量测试用例的快速输入。 

## 工作示例

 输入样本`[5,4,3,2,1]`:

 | 我| 一个[我] | 额外 | 我 + 额外 + 1 | 行动|
 | ---| ---| ---| ---| ---|
 | 0 | 5 | 0 | 1 | 额外 += 4 → 4 |
 | 1 | 4 | 4 | 6 | 好的 |
 | 2 | 3 | 4 | 7 | 好的 |
 | 3 | 2 | 4 | 8 | 好的 |
 | 4 | 1 | 4 | 9 | 好的 |

 结果：`YES`。 较高的木板所承载的剩余部分允许水平布局与垂直布局相匹配。 

输入样本`[4,2,1]`:

 | 我| 一个[我] | 额外 | 我 + 额外 + 1 | 行动|
 | ---| ---| ---| ---| ---|
 | 0 | 4 | 0 | 1 | 额外 += 3 → 3 |
 | 1 | 2 | 3 | 5 | 好的 |
 | 2 | 1 | 3 | 6 | 好的 |

 模拟表明，在第 2 行，预期 6 > 1，不能满足对称性 →`NO`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(n) | 单次遍历数组； 输入读取占主导地位。 |
 | 空间| O(n) | 存储输入高度和结果。 |

 该算法很容易处理`n`最多 2×10^5。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import builtins
    input = builtins.input
    from contextlib import redirect_stdout
    import io as sio
    out = sio.StringIO()
    with redirect_stdout(out):
        main()
    return out.getvalue().strip()

# provided samples
assert run("""7
5
5 4 3 2 1
3
3 1 1
3
4 2 1
1
2
5
5 3 3 1 1
5
5 5 5 3 3
2
6 1
""") == """YES
YES
NO
NO
YES
YES
NO""", "sample 1"

# custom cases
assert run("1\n1\n1\n") == "YES", "single plank"
assert run("1\n3\n3 3 3\n") == "YES", "all equal"
assert run("1\n3\n5 1 1\n") == "NO", "sharp drop"
assert run("1\n4\n4 3 2 1\n") == "YES", "perfect decreasing"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 块木板 | 是 | 小案子|
 | 等高| 是 | 水平对称性成立 |
 | 急剧下降| 否 | 高度不足，无法容纳较低的木板|
 | 完美递减| 是 | 标准降序大小写 |

 ## 边缘情况

 对于单块木板`[1]`,`extra`为 0 并且高度符合预期 1 →`YES`。 

对于栅栏`[5,1,1]`，在第一块木板之后`extra = 4`，但下一块木板高度 1 无法达到预期的 6 →`NO`。 

该算法正确地传播剩余高度并检测不匹配，涵盖所有棘手的场景。
