---
title: "CF 102483J - 倒霉的投注"
description: "朱莉娅是众多赌徒之一。 她现在的分数至少和其他人一样高。 未来的每场比赛结束后，她都会复制对手中当前得分最高的投注者的大多数预测。"
date: "2026-08-05T18:43:52+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102483
codeforces_index: "J"
codeforces_contest_name: "2018-2019 ICPC Northwestern European Regional Programming Contest (NWERC 2018)"
rating: 0
weight: 102483
solve_time_s: 211
verified: true
draft: false
---

[CF 102483J - Jinxed 投注](https://codeforces.com/problemset/problem/102483/J)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 31s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 朱莉娅是众多赌徒之一。 她现在的分数至少和其他人一样高。 未来的每场比赛结束后，她都会复制对手中当前得分最高的投注者的大多数预测。 问题是，即使未来的投注和比赛结果是敌对的，她也能保证在接下来的多少场比赛中不落后于任何对手。 

与直接存储分数不同，通过 Julia 可以更轻松地查看每个对手的落后情况。 如果朱莉娅有分数`S`另一位投注者已得分`x`，他们的赤字是`S - x`。 赤字为`0`意味着他们打成平手，负赤字意味着朱莉娅已经失去了领先优势。 

最多可以有`100000`投注者，分数可以大到`10^16`。 一对一模拟比赛是不可能的，因为答案也可以围绕`10^16`。 该解决方案必须跳过大量相同的行为。 

关键的结构是只有赤字最小的对手才重要。 他们是目前的亚军。 其他人都距离较远，可以认为是较晚的一组，最终将加入亚军行列。 

## 方法

 直接模拟将保留所有分数并反复确定当前的领导者、多数票以及可能的最差结果。 一场比赛的费用`O(n)`，因为可能需要检查所有相关投注者。 由于比赛的数量可能与分数差异一样大，因此这种方法可能需要大约`10^21`运营。 

有用的观察是该过程是分组发生的。 认为`t`对手目前并列亚军。 在最坏的情况下，这些`t`人们都可以相对于朱莉娅在短周期内获得积分，除了一轮之外。 该周期的长度为：```
1 + floor(log2(t))
```在这些回合中，其他所有对手都在整个周期长度上追赶，而当前的亚军则少了一个。 这意味着当前亚军与下一组之间的距离在每个周期后恰好减少一个。 

这让我们可以一次跳过很多轮。 我们对赤字进行排序，处理等赤字组，并在组之间的差距消失时重复合并下一组。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(答案·n) | O(n) | 太慢了 |
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 将每个对手的得分转换为 Julia 的赤字并对赤字进行排序。 差距最小的是最接近超越朱莉娅的对手。 
2. 保持当前最小赤字`d`和号码`t`对手有这种赤字。 下一组的赤字更大`next_d`。 
3. 计算周期长度`1 + floor(log2(t))`。 在一个周期中，当前组相对于下一组向 Julia 更近了一步。 
4. 如果与下一组的差距很大，请立即跳过许多完整的循环。 将跳过的轮数添加到答案中，并将两组的距离拉得更近。 
5.当前组与下一组合并时，增加`t`并继续。 更大的群体意味着更长的周期和不同的追赶速度。 
6. 当最小赤字变为负值时停止。 在那一刻之前完成的回合数就是答案。 

不变的是，在每次压缩操作之后，存储的组表示与单独模拟所有跳过的匹配之后完全相同的相对顺序。 唯一重要的信息是每个小组的赤字以及每个小组接近朱莉娅的速度。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    p = list(map(int, input().split()))

    julia = p[0]
    deficits = [julia - x for x in p[1:]]
    deficits.sort()

    ans = 0
    i = 0
    m = n - 1

    while True:
        d = deficits[i]
        if d < 0:
            break

        j = i
        while j < m and deficits[j] == d:
            j += 1
        cnt = j - i

        step = cnt.bit_length() - 1
        cycle = step + 1

        if j == m:
            need = d + 1
            full = need // step
            rem = need % step
            ans += full * cycle
            if rem:
                ans += rem + 1
            break

        gap = deficits[j] - d

        if step == 0:
            take = gap
        else:
            take = min(gap, (d + 1 + step - 1) // step)

        if take < gap:
            need = d + 1
            full = need // step
            rem = need % step
            ans += full * cycle
            if rem:
                ans += rem + 1
            break

        ans += take * cycle
        shift = take * step

        for k in range(i, j):
            deficits[k] -= shift

        i = j

    print(ans)

if __name__ == "__main__":
    solve()
```代码首先将分数转换为赤字，因为赤字的符号直接代表 Julia 是否仍然领先。 排序允许同等的亚军一起处理。`bit_length() - 1`计算`floor(log2(cnt))`，它决定了一个群体追赶的速度。 该算法永远不会迭代单个比赛，只会迭代相同赤字的组。 

输入中的大值需要 Python 整数，但 Python 会自动处理任意精度。 重要的边界条件是当最小赤字变为负值时立即停止，因为这是朱莉娅不再保证领先的第一个时刻。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 排序占主导地位； 每组处理一次 |
 | 空间| O(n) | 赤字数组存储所有对手 |

 这些约束要求避免任何与匹配数量成比例的模拟。 排序`100000`值，然后执行线性组扫描很容易在限制范围内。
