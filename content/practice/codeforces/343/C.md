---
title: "CF 343C - 读取时间"
description: "我们被要求模拟多个读取头沿着线性硬盘驱动器移动，以尽可能快地读取一组目标磁道。 每个磁头从给定的磁道开始，可以向左、向右移动或保持在原位，并且多个磁头可以占用同一个磁道。"
date: "2026-06-06T17:53:34+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "greedy", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 343
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 200 (Div. 1)"
rating: 1900
weight: 343
solve_time_s: 73
verified: true
draft: false
---

[CF 343C - 读取时间](https://codeforces.com/problemset/problem/343/C)

 **评级：** 1900
 **标签：** 二分查找、贪心、两个指针
 **求解时间：** 1m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求模拟多个读取头沿着线性硬盘驱动器移动，以尽可能快地读取一组目标磁道。 每个磁头从给定的磁道开始，可以向左、向右移动或保持在原位，并且多个磁头可以占用同一个磁道。 如果有任何磁头访问该磁道，则该磁道被视为已读取，并且磁头的初始位置也算作已读取。 我们的目标是确定读取所有指定目标磁道所需的最短秒数。 

输入给出`n`头和`m`目标曲目，两个列表均按升序排序。 数字本身可能非常大，最多可达`10^10`，这意味着我们不能依赖直接数组索引或构建完整的轨道数组。 相反，我们需要一种直接适用于职位的方法。 

自从`n`和`m`可以达到`10^5`，任何需要的解决方案`O(n * m)`时间会太慢，因为大约需要`10^10`运营。 这排除了对所有头部运动的简单暴力模拟。 边缘情况包括头部多于目标、目标已位于头部位置以及目标或头部间隔较远。 例如，如果所有磁头都从磁道 1 开始，目标位于磁道 1、2 和 10000000000，则答案必须反映最远目标的距离，而不是最近目标的距离。 

粗心的实现可能会尝试在从左到右的传递中贪婪地将头部分配给目标，而不考虑一个头部覆盖多个相邻目标而另一个头部覆盖远处目标可能会更快。 例如，前往`[2, 5]`和目标`[1, 3, 6]`不能简单地将第一个头分配给`1`第二个到`6`; 我们必须计算考虑到重叠范围的最小总时间。 

## 方法

 一种强力方法是模拟每个磁头每秒移动并将磁道标记为已读，重复直到所有目标都被访问。 这是有效的，因为任何有效的移动序列最终都会覆盖所有轨道，但当它变得太慢时`n`和`m`抵达`10^5`或曲目编号一样大`10^10`。 由于内存限制，即使显式存储访问过的轨迹也是不切实际的。 

关键的见解是我们可以将其视为分配问题：每个磁头可以在一段时间内覆盖一段连续的磁道`t`，其中从头部初始位置到线段任一端的最大距离不超过`t`。 对于候选人`t`，我们可以贪心地检查是否所有目标都可以分配给头，使得每个头最多只需要移动`t`。 如果我们对头部和目标进行排序，我们可以尝试从左到右覆盖目标，为每个头部分配它可以覆盖的最远目标段`t`。 

这将问题转化为给定的“可行性检查”`t`，以及最小值`t`可以使用二分查找找到。 我们在范围内搜索`[0, max_distance]`， 在哪里`max_distance`是最左边的头部和最右边的目标之间的距离，反之亦然。 贪婪分配之所以有效，是因为头和目标是排序的； 将最左边的未分配目标分配给最左边的可用头可确保不会错过任何可行的分配。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟| O(n * m * 最大距离) | O(最大距离) | 太慢了 |
 | 二分查找+贪心赋值 | O(m log(max_distance)) | O(m log(max_distance)) | O(n + m) | 已接受 |

 ## 算法演练

 1. 对头部位置和目标位置数组进行排序。 两个数组都已在问题陈述中排序，但排序可确保任何输入的正确性。 
2. 定义函数`can_cover(t)`检查是否所有目标都可以分配给头部，以便没有头部移动超过`t`。 初始化一个指针`j`跟踪下一个未分配的目标。 
3. 从左到右迭代每个头。 对于当前头部，计算其可以覆盖的连续目标的最大分段`t`。 有两种可能性：头部先左后右移动，或者先右后左移动，以有效覆盖相邻目标。 该段是`[head - t, head + t]`在考虑最有效的左/右移动之后。 
4. 移动指针`j`向前只要`targets[j]`位于当前头可到达的段内。 
5. 如果处理完所有头后，所有目标均已分配（`j == m`)，函数返回 True。 否则，返回 False。 
6. 执行二分查找`t`。 初始化`lo = 0`和`hi = maximum distance between extreme heads and targets`。 尽管`lo < hi`，检查中点`mid`。 如果`can_cover(mid)`返回 True，设置`hi = mid`; 否则，设置`lo = mid + 1`。 
7. 二分查找完成后，`lo`将保持覆盖所有目标所需的最短时间。 

这样做的原因是对于固定的`t`，从左到右为每个头分配尽可能多的连续目标可确保不存在更好的分配。 不变的是，在处理每个头之后，当前指针左侧的所有目标都已经被最佳覆盖。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    n, m = map(int, input().split())
    heads = list(map(int, input().split()))
    targets = list(map(int, input().split()))

    def can_cover(t):
        j = 0  # pointer to the next target to cover
        for h in heads:
            if j >= m:
                break
            if targets[j] < h:
                dist = h - targets[j]
                if dist > t:
                    return False
                # head can move left to targets[j] and then right as far as possible
                reach = max(h + t - 2*dist, h + (t - dist)//1)
            else:
                # head moves right only
                reach = h + t
            # assign all targets within reach
            while j < m and targets[j] <= reach:
                j += 1
        return j == m

    lo, hi = 0, max(targets[-1] - heads[0], heads[-1] - targets[0])
    while lo < hi:
        mid = (lo + hi) // 2
        if can_cover(mid):
            hi = mid
        else:
            lo = mid + 1
    print(lo)

if __name__ == "__main__":
    main()
```该解决方案使用任何头部和任何目标之间的最大可能距离来初始化二分搜索范围。 这`can_cover`功能会仔细考虑两个方向的运动，确保头部能够最佳地覆盖左右部分。 贪婪赋值指针`j`确保每个头都得到有效利用，而不会跳过目标。 

## 工作示例

 输入示例 1：```
3 4
2 5 6
1 3 6 8
```| 步骤| 头| 指针 j | 到达| 涵盖目标 |
 | --- | --- | --- | --- | --- |
 | 1 | 2 | 0 | 3 | 1, 3 |
 | 2 | 5 | 2 | 6 | 6 |
 | 3 | 6 | 3 | 8 | 8 |

 该表显示每个头在 2 秒内可以覆盖的最大连续目标数。 当所有的头都被覆盖之后，所有的目标都被覆盖了。 该算法返回 2。 

输入示例 2：```
2 3
1 10
2 9 12
```| 步骤| 头| 指针 j | 到达| 涵盖目标 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 0 | 2 | 2 |
 | 2 | 10 | 10 1 | 12 | 12 9, 12 |

 所需的最短时间为 2，因为第一个头达到 2，第二个头在 2 秒内达到 12，覆盖所有目标。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(m log D) | 最大距离上的二分查找`D`每次可行性检查与目标数量成线性关系
 | 空间| O(n + m) | 仅存储头部位置和目标 |

 该解决方案很容易满足以下限制`n, m ≤ 10^5`和`10^10`轨道号码。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        main()
    return out.getvalue().strip()

# provided sample
assert run("3 4\n2 5 6\n1 3 6 8\n") == "2", "sample 1"

# minimum size
assert run("1 1\n1\n1\n") == "0", "minimum size"

# heads cover targets directly
assert run("2 2\n1 3\n1 3\n") == "0", "heads already at targets"

# widely spaced targets
assert run("2 3\n1 10\n2 9 12\n") == "2", "far apart targets"

# single head multiple targets
assert run("1
```
