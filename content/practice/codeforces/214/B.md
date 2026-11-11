---
title: "CF 214B - 家庭任务"
description: "我们得到一组数字，并要求从其中的一些或全部数字构造最大的整数，使得所得数字可以同时被 2、3 和 5 整除。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "constructive-algorithms", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 214
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 131 (Div. 2)"
rating: 1600
weight: 214
solve_time_s: 169
verified: true
draft: false
---

[CF 214B - 家庭任务](https://codeforces.com/problemset/problem/214/B)

 **评分：** 1600
 **标签：** 暴力、构造性算法、贪心、数学
 **求解时间：** 2m 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一组数字，并要求从其中的一些或全部数字构造最大的整数，使得所得数字可以同时被 2、3 和 5 整除。 由于能被 2、3 和 5 整除的数字也能被 30 整除，因此任务简化为从给定的数字中构建能被 30 整除的最大数字。 输入由单个整数组成`n`代表位数，后面跟着`n`数字之间用空格分隔。 输出是最大的有效数字或`-1`如果不存在这样的号码。 不允许使用前导零，除非数字零本身。 

约束条件允许`n`最多 100,000，因此任何复杂度低于 O(n log n) 的解决方案都可能超出时间限制。 我们必须避免枚举所有可能的数字排列的方法，因为这将是阶乘`n`并且完全不可行。 边缘情况包括只有零、单个数字不能形成 30 的倍数，或者总和不能被 3 整除但包含零的数字，这将阻止被 30 整除。例如，输入`1 5`应该产生`-1`， 不是`5`，因为没有任何组合可以形成 30 的倍数。 

## 方法

 最简单的方法是生成数字的所有排列，检查每个排列的整除性，并保留最大值。 这种暴力破解之所以有效，是因为它能正确识别能被 30 整除的数字，但在最坏的情况下其复杂度为 O(n!)，这使得它完全不可行`n`最多 100,000。 

关键的见解是分解可分性规则。 能被 2 整除的数字必须至少有一个偶数，能被 5 整除的数字必须以 0 或 5 结尾，能被 3 整除的数字必须有数字总和是 3 的倍数。将这些数字组合起来才能被 30 整除，最后一位数字必须为 0（因为它是唯一能同时被 2 和 5 整除的数字）。 一旦我们知道零存在，我们就必须调整数字之和，使其能被 3 整除。因为我们想要最大数字，所以数字应该按降序排列。 这将问题简化为计算数字、调整它们的和模 3，并按降序打印它们。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!) | O(n!) | 太慢了 |
 | 最佳 | O(n) | O(10) | 已接受 |

 ## 算法演练

 1.读取位数`n`和数字列表。 使用大小为 10 的频率数组计算每个数字的出现次数。 
2. 检查是否至少有一个零。 如果没有，则打印`-1`因为能被30整除的数一定以0结尾。 
3. 计算所有数字的总和。 如果模 3 的和不为零，则删除使总和可被 3 整除所需的最小数字集。我们可以删除一位余数为 1 的数字或两位余数为 2 的数字（反之亦然）来固定总和。 优先删除最小的数字以使最终数字最大化。 
4. 调整后，如果除了零之外没有剩下任何数字，则打印`0`。 这处理全零的情况。 
5. 通过从数字 9 向下迭代到 0 并附加每个数字调整后出现的次数来构造最大数字。 
6. 打印结果数字。 

工作原理：该算法保持数字之和可被 3 整除且数字以零结尾的不变量，确保能被 30 整除。按降序对数字进行排序可最大化数字。 删除最少的数字可以保留最大可能的剩余数字。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
digits = list(map(int, input().split()))

count = [0]*10
for d in digits:
    count[d] += 1

if count[0] == 0:
    print(-1)
    sys.exit()

total = sum(d * count[d] for d in range(10))
mod = total % 3

def remove_digits(mod_val):
    # Try removing smallest digit with remainder mod_val
    for r in range(1, 10):
        if r % 3 == mod_val and count[r] > 0:
            count[r] -= 1
            return True
    # Try removing two smallest digits with remainder 3 - mod_val
    needed = 2
    for r in range(1, 10):
        if r % 3 == (3 - mod_val):
            while count[r] > 0 and needed > 0:
                count[r] -= 1
                needed -= 1
            if needed == 0:
                return True
    return False

if mod != 0:
    if not remove_digits(mod):
        print(-1)
        sys.exit()

# handle all zeros
if sum(count[1:]) == 0:
    print(0)
    sys.exit()

res = []
for d in range(9, -1, -1):
    res.extend([str(d)]*count[d])
print(''.join(res))
```该代码首先计算数字并确保至少存在一个零。 通过删除满足整除性的最小位数来校正模 3 的和。 输出按最大值的降序构建。 如果仅保留零，则进行特殊处理。 

## 工作示例

 样本1：

 | 数字| 计数| 总和| 模组| 删除| 最终计数| 结果 |
 | --- | --- | --- | --- | --- | --- | --- |
 | [0]| 0..1..0 | 0..1..0 0 | 0 | 无 | 0..1..0 | 0..1..0 0 |

 这证实了该算法正确地识别出零是唯一能被 30 整除的数字。 

样本2：

 | 数字| 计数| 总和| 模组| 删除| 最终计数| 结果 |
 | --- | --- | --- | --- | --- | --- | --- |
 | [5,5,5,4,4,4,3,3,3,0] | 计数 0..9 | 36 | 36 0 | 无 | 相同 | 5554443330 |

 这表明该算法保留了最大的数字而不需要删除数字。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 计数位数为 O(n)，调整和打印为 O(10) |
 | 空间| O(10) | 只需要固定大小的频率数组 |

 该解决方案很容易满足时间和内存的限制，因为主要操作与位数成线性比例。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    digits = list(map(int, input().split()))
    count = [0]*10
    for d in digits:
        count[d] += 1
    if count[0] == 0:
        return "-1"
    total = sum(d * count[d] for d in range(10))
    mod = total % 3
    def remove_digits(mod_val):
        for r in range(1, 10):
            if r % 3 == mod_val and count[r] > 0:
                count[r] -= 1
                return True
        needed = 2
        for r in range(1, 10):
            if r % 3 == (3 - mod_val):
                while count[r] > 0 and needed > 0:
                    count[r] -= 1
                    needed -= 1
                if needed == 0:
                    return True
        return False
    if mod != 0:
        if not remove_digits(mod):
            return "-1"
    if sum(count[1:]) == 0:
        return "0"
    res = []
    for d in range(9, -1, -1):
        res.extend([str(d)]*count[d])
    return ''.join(res)

# provided samples
assert run("1\n0\n") == "0"
assert run("10\n5 5 5 4 4 4 3 3 3 0\n") == "5554443330"
assert run("1\n5\n") == "-1"
# custom cases
assert run("3\n0 0 0\n") == "0", "all zeros"
assert run("5\n3 3 3 3 0\n") == "33330", "sum divisible by 3 with zero"
assert run("4\n1 1 1 0\n") == "1110", "remove one digit to fix modulo 3"
assert run("5\n1 4 4 0 0\n") == "44100", "maximize number with multiple zeros"
assert run("6\n9 8 7 0 0 0\n") == "987000", "descending order with multiple zeros"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 3\n0 0 0 | 3\n0 0 0 0 | 全零情况|
 | 5\n3 3 3 3 0 | 5\n3 3 3 3 0 33330 | 总和可被 3 整除为零 |
 | 4\n1 1 1 0 | 4\n1 1 1 0 1110 | 1110 删除一位数字以修复模 3 |
 | 5\n1 4 4 0 0 | 5\n1 4 4 0 0 44100 | 最大化带有多个零的数字 |
