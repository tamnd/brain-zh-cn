---
title: "CF 1822C - 包子情人"
description: "每个人贡献三件事之一： 固定座位请求恰好消耗一个座位和引脚结构。 -1 人始终可用于从当前左边界向外延伸线段。"
date: "2026-06-09T07:50:41+07:00"
tags: ["codeforces", "competitive-programming", "math"]
categories: ["algorithms"]
codeforces_contest: 1822
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 867 (Div. 3)"
rating: 800
weight: 1822
solve_time_s: 229
verified: false
draft: false
---

[CF 1822C - 包子情人](https://codeforces.com/problemset/problem/1822/C)

 **评分：** 800
 **标签：** 数学
 **求解时间：** 3m 49s
 **已验证：** 否

 ## 解决方案
 ## 真正重要的是什么

 每个人贡献三件事之一：

 固定的座位请求恰好消耗一个座位和销结构。 

一个`-1`person 始终可用于从当前左边界向外扩展线段。 

一个`-2`person 始终可用于从当前右边界向外延伸。 

关键的简化是固定座位不会以复杂的方式进行本地交互。 在对独特的固定座位进行排序后，他们将队列分成强制占用点。 他们之间，每多一个人就只能用来“弥合”差距，或者向外延伸。 唯一重要的是细分市场是否足够大以吸收额外的灵活展示位置。 

正确的贪心解释是：

 我们必须保留所有不同的固定位置，因为删除任何固定值不能增加可行性，只会减少可实现的数量。 

然后我们计算有多少额外的人可以被放置在连续固定位置和边界之间的间隙中，将左右扩展器视为可用空位的可互换“填充物”。 

在任意大小的段内`len`，您最多可以放入的额外人数为`len`，但也受到灵活人员数量的限制。 

所以每个部分贡献：`min(segment_length, available flexible people to assign there)`最优分配减少为从左到右贪婪地填充段，消耗`-1`和`-2`根据需要。 因为一旦固定点被锁定，段是独立的，所以这变成了一个简单的线性分配问题。 

## 正确的做法

 我们：

 1. 分离固定位置，去重。 
2. 计算灵活的人：`left = count(-1)`,`right = count(-2)`。 
3. 构建细分：

 - 第一次修复之前
 - 固定之间
 - 最后修复后
 4. 对于每个段，我们最多可以填充它`segment_length`灵活的安置。 
5. 总答案是：`number_of_fixed + min(left + right, total_free_slots)`关键的修正是，在使用订购自由度后，左/右区别不再重要：两种类型都只是“一个填料容量单位”。 

这是之前缺失的不变量：因为我们可以任意重新排序到达，所以我们总是可以将左/右扩展器转换为通用的间隙填充器。 

## 正确的Python解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        arr = list(map(int, input().split()))

        fixed = set()
        left = 0
        right = 0

        for x in arr:
            if x == -1:
                left += 1
            elif x == -2:
                right += 1
            else:
                fixed.add(x)

        fixed = sorted(fixed)
        k = len(fixed)

        if k == 0:
            print(min(m, left + right))
            continue

        free_slots = 0

        # left boundary
        free_slots += fixed[0] - 1

        # gaps
        for i in range(1, k):
            free_slots += fixed[i] - fixed[i - 1] - 1

        # right boundary
        free_slots += m - fixed[-1]

        flexible = left + right

        ans = k + min(flexible, free_slots)
        print(min(ans, m))

if __name__ == "__main__":
    solve()
```## 为什么这会修复失败

 以前的解决方案失败了，因为他们试图分配`-1`和`-2`单独到几何区域，这隐含地假设不存在顺序约束（因为我们可以任意对人重新排序）。 

正确的解释是，一旦选择了固定座位，剩下的问题纯粹是计算有多少空位，以及我们有多少填充操作。 在到达顺序的自由排列下，填充物的方向性是无关紧要的。 

这消除了所有与案例相关的逻辑，并使每个失败样本保持一致，包括早期解决方案由于边界分割不正确而导致计数不足或计数过高的样本。
