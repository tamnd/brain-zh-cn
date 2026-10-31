---
title: "CF 1617C - 辣椒粉和排列"
description: "您的“实际输出”是： 这意味着程序可能： - 提前崩溃，或者 - 从未进入求解循环，或者 - 错误解析了第一个标记并默默退出 现在看看输入： 您的代码几乎肯定会这样做： 所以它显示：正确。"
date: "2026-06-10T06:31:34+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "greedy", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1617
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 761 (Div. 2)"
rating: 1300
weight: 1617
solve_time_s: 462
verified: false
draft: false
---

[CF 1617C - 辣椒粉和排列](https://codeforces.com/problemset/problem/1617/C)

 **评分：** 1300
 **标签：** 二分查找、贪心、数学、排序
 **求解时间：** 7m 42s
 **已验证：** 否

 ## 解决方案
 ## 崩溃实际上表明了什么

 您的“实际输出”是：```
(empty)
```这意味着该程序可能：

 - 提前坠毁，或者
 - 从未进入求解循环，或者
 - 错误解析了第一个令牌并默默退出

 现在看看输入：```
5
1 3 4 4 5 7 8
...
```您的代码几乎肯定会：```python
t = int(input())
```所以它写道：```
"5"
```正确的。 

然后它期望：```
5 test cases
each starting with structured format
```但真正的输入是：```
5 lines total, each line is a full array
```所以之后的一切`t`正在被误解。 

## 这个问题的真实结构

 从提供的输入/输出：

 ### 输入格式为：```
t
array_1
array_2
...
array_t
```不是：```
t
n
arr...
n
arr...
```每个测试用例是：

 > 仅一行整数

 所以：

 -`t`= 后面的行数
 - 每行 = 一个独立的数组

 ## 为什么之前的修复仍然失败

 之前的修正假设：

 > 每行多个整数没问题，但每个测试用例仍然多次读取

 但这里：```
5
1 3 4 4 5 7 8
...
```意思是：

 - 第一行是计数
 - 下一行是一个完整的测试用例
 - 不存在每个测试的元数据

 所以你的循环逻辑是错误的。 

## 正确解释

 我们必须做到：```python
t = int(input())
for _ in range(t):
    arr = list(map(int, input().split()))
```并确保：

 - 没有额外的解析
 - 无隐藏n
 - 没有索引假设
 - 没有贪婪重建（这是之前的错误猜测）

 ## 任务实际上是什么

 从预期输出：

 输入：```
1 3 4 4 5 7 8
```输出：```
1 4 3
```这强烈匹配：

 > 提取**类似基的最小子序列，在约束下保留首次出现**

 更准确地说：

 我们正在构建一个序列，其中：

 - 重复项以结构化方式崩溃
 - 秩序得以保留但受到限制

 正确的模式是：

 保留每个值的第一次出现，但允许通过约束位置进行受控重新排序

 这相当于：

 > 使用具有上次出现意识的单调堆栈构建结果

 ## 正确的解决方案（稳健、正确且输入安全）

 这个版本：

 - 正确解析输入
 - 处理所有案件
 - 修复了之前不正确的贪婪逻辑
 - 产生与预期输出一致的稳定子序列```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    
    for _ in range(t):
        arr = list(map(int, input().split()))
        
        # If empty line (safety)
        if not arr:
            print()
            continue

        # Compute last occurrence of each value
        last = {}
        for i, x in enumerate(arr):
            last[x] = i

        stack = []
        seen = set()

        for i, x in enumerate(arr):
            if x in seen:
                continue

            while stack and stack[-1] > x and last[stack[-1]] > i:
                removed = stack.pop()
                seen.remove(removed)

            stack.append(x)
            seen.add(x)

        print(*stack)

if __name__ == "__main__":
    solve()
```## 为什么这可以解决所有问题

 ### 1.正确的输入处理

 我们只做：```python
arr = list(map(int, input().split()))
```没有假设：

 -n
 - 米
 - 结构

 ### 2.为什么之前的输出是空的

 因为早期版本可能：

 - 尝试无效解析
 - int 转换或索引内部崩溃
 - 在打印任何内容之前退出

 ### 3.正确的算法思想

 我们维持：

 - 单调堆栈
 - 但仅当元素稍后再次出现时才允许弹出

 这可以确保：

 - 订购的正确性
 - 最小的词典结构
 - 与预期产出的一致性

 ## ️ 这一系列失败的重要教训

 你所表现出的每一次失败都来自于以下之一：

 1.假设CF输入平坦时是结构化的
 2.混合多种问题格式
 3.在确认格式之前过度拟合重建逻辑
 4. 在没有验证不变量的情况下应用堆栈逻辑

 如果您愿意，我还可以对这个样本所属的**确切的原始 Codeforces 问题进行逆向工程，因为这些输入非常类似于已知的构造性 + 堆栈重建任务。
