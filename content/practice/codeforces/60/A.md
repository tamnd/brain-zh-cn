---
title: "CF 60A - 我的薄片在哪里？"
description: "有n个盒子排成一条直线。 其中一个可能含有谷物片。 室友留下了两种可能形式的陈述。 如果提示说“在 i 的左侧”，则薄片必须严格位于框 i 之前的某个位置。 盒子i本身也是不可能的。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 60
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 56"
rating: 1300
weight: 60
solve_time_s: 100
verified: true
draft: false
---

[CF 60A - 我的碎片在哪里？](https://codeforces.com/problemset/problem/60/A)

 **评分：** 1300
 **标签：**实现、两个指针
 **求解时间：** 1m 40s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 有`n`盒子排列成一条直线。 其中一个可能含有谷物片。 室友留下了两种可能形式的陈述。 

如果提示说`"To the left of i"`，那么薄片必须严格位于盒子之前的某个地方`i`。 盒子`i`本身也是不可能的。 

如果提示说`"To the right of i"`，那么薄片必须严格位于盒子之后的某个地方`i`。 再说一遍，盒子`i`本身就被排除在外。 

任务是确定应用每个提示后仍然可能有多少个盒子。 如果没有一个框同时满足所有提示，则提示相互矛盾，答案为`-1`。 

限制非常小。 两个都`n`和`m`至多是`1000`，所以即使是一个`O(nm)`在最坏的情况下，解决方案仅执行大约一百万次操作，这很容易满足时间限制。 这意味着我们不需要高级数据结构或大量优化。 直接模拟已经足够快了。 

棘手的部分是正确处理不平等问题。 每个语句都不包括引用的框本身，因此`"To the left of 3"`只允许盒子`1`和`2`， 不是`3`。 

当多个提示挤压有效间隔直到没有剩余时，会出现另一种微妙的情况。 

考虑：```
5 2
To the left of 3
To the right of 3
```第一个提示仅允许盒子`1`和`2`。 

第二个只允许盒子`4`和`5`。 

没有一个盒子能同时满足两者，所以正确答案是：```
-1
```将提示视为非严格不等式的粗心实现可能会错误地思考`3`仍然有效。 

另一个容易犯的错误是忽略重复的提示。```
4 3
To the left of 3
To the left of 3
To the left of 3
```答案依然是`2`，因为重复约束不会改变有效范围。 

边界提示也很重要。```
5 1
To the left of 1
```严格来说box之前是没有box的`1`，所以答案是`-1`。 

忘记严格性的幼稚实现可能会错误地返回`1`。 

## 方法

 最直接的解决办法就是暴力破解。 对于每一个盒子`1`到`n`，我们测试它是否满足每一个提示。 如果一个盒子违反了哪怕一个条件，我们就会丢弃它。 最后，我们计算有多少个盒子幸存下来。 

这是可行的，因为约束很小。 至多有`1000`盒子和`1000`提示，最坏情况的工作是：```
1000 × 1000 = 1,000,000 checks
```这在 Python 中是完全安全的。 

不过，这个问题的结构更加清晰。 每个提示仅限制一侧的有效间隔。 

声明`"To the left of i"`方法：```
position < i
```声明`"To the right of i"`方法：```
position > i
```我们可以维护当前的有效间隔，而不是针对每个条件检查每个框。 

我们保留两个值：```
L = smallest possible position
R = largest possible position
```最初：```
L = 1
R = n
```对于每个`"To the left of i"`提示，我们更新：```
R = min(R, i - 1)
```对于每个`"To the right of i"`提示，我们更新：```
L = max(L, i + 1)
```处理完所有提示后：

 如果`L > R`，不存在有效的框，我们打印`-1`。 

否则，每个盒子`[L, R]`是可能的，所以答案是：```
R - L + 1
```蛮力方法之所以有效，是因为条件是独立的并且易于一一验证。 区间观察之所以有效，是因为每个约束仅影响一个边界，因此所有有效框始终形成一个连续的线段。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(纳米) | O(1) | O(1) | 已接受 |
 | 最佳| O(米) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 阅读`n`和`m`。 
2. 将有效区间初始化为整组框。```
L = 1
R = n
```此时，每个盒子里都可以装着薄片。 

1. 逐一处理每个提示。 
2. 如果提示说`"left of i"`，那么每个有效框必须严格小于`i`。 

更新：```
R = min(R, i - 1)
```我们缩小右边界，因为盒子`i`及以上都是不可能的。 

1. 如果提示说`"right of i"`，那么每个有效框必须严格大于`i`。 

更新：```
L = max(L, i + 1)
```我们缩小左边界，因为盒子`i`而之前是不可能的。 

1. 处理完所有提示后，检查间隔是否仍然有效。 

如果：```
L > R
```那么约束相互矛盾，所以打印`-1`。 

1. 否则，每个盒子`L`到`R`是可能的。 

这样的盒子的数量是：```
R - L + 1
```### 为什么它有效

 每个提示都会删除该行框的前缀或后缀。 经过几次这样的操作后，剩余的有效位置仍必须形成一个连续的区间。`L`始终存储满足每个已处理提示的最小位置。`R`始终存储满足每个已处理提示的最大位置。 

每当新的约束到达时，我们都会将当前间隔与该提示允许的间隔相交。 由于区间交集保留了正确性，因此最终的`[L, R]`段恰好包含同时满足所有提示的框。 

如果间隔变空，则不存在有效框。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())

left = 1
right = n

for _ in range(m):
    parts = input().split()
    
    direction = parts[2]
    x = int(parts[4])
    
    if direction == "left":
        right = min(right, x - 1)
    else:
        left = max(left, x + 1)

if left > right:
    print(-1)
else:
    print(right - left + 1)
```程序在整个输入处理过程中保持当前的有效间隔。`left`表示仍然可能的最小框索引，而`right`代表最大。 

输入行始终遵循相同的结构：```
To the left of i
To the right of i
```分割线后：```
parts = ["To", "the", "left", "of", "i"]
```方向位于索引处`2`数字位于索引处`4`。 

为了`"left"`提示，最大的有效索引变为`x - 1`。 

为了`"right"`提示，最小的有效索引变为`x + 1`。 

严格的不平等是最重要的实施细节。 使用`x`而不是`x - 1`或者`x + 1`会在边界情况下产生错误的答案。 

最后，如果间隔变得无效，意味着`left > right`，没有可行的盒子，答案是`-1`。 

## 工作示例

 ### 示例 1

 输入：```
2 1
To the left of 2
```| 步骤| 提示| 左| 对|
 | --- | --- | --- | --- |
 | 初始| 无 | 1 | 2 |
 | 1 | 左边 2 | 1 | 1 |

 最终的间隔是`[1, 1]`，因此只剩下一个盒子是可能的。 

输出：```
1
```此示例演示单个约束如何修剪间隔的一侧。 

### 示例 2

 输入：```
5 3
To the left of 5
To the right of 1
To the left of 4
```| 步骤| 提示| 左| 对|
 | --- | --- | --- | --- |
 | 初始| 无 | 1 | 5 |
 | 1 | 左边 5 | 1 | 4 |
 | 2 | 1 的右边 | 2 | 4 |
 | 3 | 左边 4 | 2 | 3 |

 剩余的有效框是`2`和`3`。 

输出：```
2
```此跟踪显示了多个提示如何通过间隔交集进行组合。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(米) | 每个提示都会处理一次 |
 | 空间| O(1) | O(1) | 只存储了几个整型变量 |

 至多有`1000`提示，该算法基本上立即运行。 内存使用量是恒定的，因为不需要辅助数组或数据结构。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    n, m = map(int, input().split())

    left = 1
    right = n

    for _ in range(m):
        parts = input().split()

        direction = parts[2]
        x = int(parts[4])

        if direction == "left":
            right = min(right, x - 1)
        else:
            left = max(left, x + 1)

    if left > right:
        print(-1)
    else:
        print(right - left + 1)

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    solve()

    sys.stdout = sys.__stdout__
    return out.getvalue().strip()

# provided sample
assert run(
"""2 1
To the left of 2
"""
) == "1", "sample 1"

# minimum input, no hints
assert run(
"""1 0
"""
) == "1", "single box remains valid"

# contradiction from boundaries
assert run(
"""5 2
To the left of 1
To the right of 5
"""
) == "-1", "empty interval"

# duplicate hints
assert run(
"""4 3
To the left of 3
To the left of 3
To the left of 3
"""
) == "2", "duplicates should not matter"

# interval squeezed to one point
assert run(
"""10 2
To the right of 4
To the left of 6
"""
) == "1", "only box 5 remains"

# no restriction after wide hints
assert run(
"""7 2
To the left of 7
To the right of 1
"""
) == "5", "middle segment survives"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 0`|`1`| 最小尺寸输入 |
 |`left of 1`和`right of 5`|`-1`| 矛盾的约束 |
 | 重复相同的提示|`2`| 重复处理|
 |`right of 4`和`left of 6`|`1`| 单一剩余位置 |
 | 宽边界约束|`5`| 正确的间隔计数 |

 ## 边缘情况

 考虑矛盾的情况：```
5 2
To the left of 3
To the right of 3
```加工`"left of 3"`给出：```
left = 1
right = 2
```加工`"right of 3"`给出：```
left = 4
right = 2
```现在`left > right`，所以区间为空并且算法打印`-1`。 

这证实了正确检测到互斥提示。 

现在考虑边界情况：```
5 1
To the left of 1
```更新后变为：```
right = min(5, 0) = 0
```现在的间隔是：```
left = 1
right = 0
```再次`left > right`，因此不存在有效的框。 

这验证了该实现是否正确处理了数组末端附近的严格不等式。 

最后，考虑重复约束：```
4 3
To the left of 3
To the left of 3
To the left of 3
```在第一个提示之后：```
right = 2
```接下来的两个提示不会改变任何内容，因为：```
min(2, 2) = 2
```最终的间隔是`[1, 2]`，所以答案是`2`。 

这证实了重复提示不会意外地过度缩小间隔。
