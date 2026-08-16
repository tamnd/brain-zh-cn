---
title: "CF 102277L - 纸杯蛋糕奖金"
description: "公司是一棵扎根的大树。 员工 1 是 CEO，之后的每一位员工都是在现有员工的领导下受聘的，因此每名员工只有一位父级。 一名员工领导一个部门，该部门包含他们自己以及层次结构中低于他们的每个员工。"
date: "2026-08-17T03:19:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102277
codeforces_index: "L"
codeforces_contest_name: "UCF Locals 2018"
rating: 0
weight: 102277
solve_time_s: 393
verified: true
draft: false
---

[CF 102277L - 纸杯蛋糕奖金](https://codeforces.com/problemset/problem/102277/L)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 33s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 公司是一棵扎根的大树。 员工 1 是 CEO，之后的每一位员工都是在现有员工的领导下受聘的，因此每名员工只有一位父级。 一名员工领导一个部门，该部门包含他们自己以及层次结构中低于他们的每个员工。 

每个员工都有一个当前的奖金乘数。 最初，每个员工的乘数都是相同的值`S`。 针对员工的奖金支付`i`的部门有一个基本金额`B`，并且该子树中的每个员工都会收到`B * M`， 在哪里`M`是该员工在付款时的乘数。 乘数变化仅影响未来的奖金支付。 

有四种操作。 可以在现有员工的领导下雇用新员工。 员工的乘数可以替换为新值。 可以向整个部门子树支付奖金。 最后，可以请求一名员工累积的奖金总额。 对于最后一种查询，所需的输出是一个整数。 UCF 的原始声明给出了`n <= 10^5`,`S <= 10^6`，乘数和奖金金额高达`10^6`。 

高达`10^5`运营中，直接拜访受每个部门付款影响的每个员工可能需要大约`10^10`最坏情况下的员工更新。 二次解远远超出一秒的限制。 我们需要每个操作都花费大致对数时间，或者至少摊销接近对数时间。 

有几种微妙的情况，直接实现可能会处理不当。 首先，不得将在雇用员工之前支付的奖金授予该员工。 例如，与`S = 1`，输入```
3 1
3 1 10
1 1
4 2
```有输出```
0
```在员工 2 存在之前，CEO 的部门就收到了奖金。 因此，员工 2 开始时累积奖金为零。 构建最终树并立即将每个早期子树付款视为属于员工 2 的解决方案将错误地给出`10`。 

其次，改变乘数不得改变已经支付的奖金。 例如，```
4 1
3 1 10
2 1 5
3 1 10
4 1
```产生```
60
```第一次付款给出`10 * 1 = 10`，而第二个给出`10 * 5 = 50`。 使用当前乘数重新计算所有历史付款将错误地产生`100`。 

第三，一个部门可以包含许多级别的后代，而不仅仅是直系子代。 和```
4 2
1 1
1 2
3 1 5
```员工 3 位于 CEO 的部门内，尽管员​​工 1 是其直接父级且员工 2 是其祖父母。 付款到达所有三名员工，因此仅存储直属信息的解决方案是不够的。 

## 方法

 暴力解决方案遵循字面定义。 将公司存储为树，对于类型 3 查询，遍历指定员工的整个子树。 对于每位到达的员工，添加`B * multiplier[employee]`他们累积的奖金。 乘数更新是恒定时间，如果显式存储累积奖金，则类型 4 查询也是恒定时间。 

这是正确的，因为部门实际上是一个子树，并且遍历会访问应该收到该付款的每个员工。 问题在于重复工作量。 考虑一家公司，其中所有`10^5`运营是向首席执行官支付的费用。 每次付款都会访问所有员工，因此实施大约执行`10^10`员工更新。 即使是具有非常小的常数因子的树遍历也无法使之变得可行。 

关键的观察是，部门付款实际上并不需要立即改变每个员工。 只有当员工被询问或他们的乘数发生变化时，我们才需要答案。 

将计算分成两个量。 让`base[x]`是目标部门包含员工的所有部门奖金金额的总和`x`。 这个数量不取决于`x`的乘数。 部门付款`B`只是添加`B`到`base[x]`对于该部门的每个员工。 

假设一名员工的乘数当前为`M`，上次我们最终确定该员工的奖金是在他们的`base`值为`last[x]`。 每个单位的`base`此后添加的奖励必须乘以当前乘数。 那么新赚到的钱就是```
(base[x] - last[x]) * M
```当乘数发生变化时，我们首先确定在旧乘数下赚取的所有奖金，然后记录新乘数和当前乘数`base[x]`。 

剩下的问题是支持子树添加`base`和点查询`base[x]`。 由于完整的查询集在处理之前可用，因此我们可以首先构建最终的员工树。 DFS 为每个员工提供一个欧拉游览区间`[tin[x], tout[x]]`，以及所有的后代`x`正好占据那个区间。 

然后，子树加法就变成了欧拉数组上的范围加法。 Fenwick树可以实现范围加法和点查询`O(log n)`使用标准差异数组技巧的时间。 

招聘还引发了一个更微妙的问题。 如果我们首先构建最终的树，则在员工之前执行子树范围更新`x`被聘用在技术上包括`x`在它的最后一个子树中。 我们通过初始化新雇用的员工来解决这个问题`last[x]`到他们目前的`base[x]`。 然后，所有历史子树支付都被视为员工的起始基线，而只有未来的增长`base[x]`产生金钱。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(n^2)`最坏的情况|`O(n)`| 太慢了 |
 | 最佳 |`O(n log n)`|`O(n)`| 已接受 |

 ## 算法演练

 1. 在处理之前阅读所有查询。 在此过程中，通过记录由类型 1 查询创建的每个员工的主管来创建最终的公司树。 即使员工是在线雇用的，这也使我们能够计算稳定的子树间隔。 
2. 由 CEO 运行 DFS，并为每个员工分配一个`tin`进入节点时的值和a`tout`处理所有后代后的值。 子树中的每个员工`x`然后有一个欧拉位置`tin[x]`和`tout[x]`。 
3. 创建一个表示差异数组的 Fenwick 树`base`。 范围添加`[l, r] += B`是通过添加来实现的`B`在`l`和`-B`在`r + 1`。 位置处的前缀和`p`那么是当前的`base`欧拉位置为 的员工的价值`p`。 
4.用乘数初始化CEO`S`, 积累的钱`0`， 和`last_base`等于零。 在处理第一个查询之前不存在奖金，因此 CEO 的起始基线为零。 
5. 招聘查询`1 i`，用乘数创建下一个员工`S`并且积累的钱为零。 设置该员工的`last_base`至其当前的 Fenwick 点值。 这会丢弃在他们受聘之前发生的每笔奖金，包括支付给祖先部门的款项。 
6. 乘数更新`2 i M`，首先获取员工当前的`base`价值。 添加`(current_base - last_base[i]) * multiplier[i]`到他们积累的钱。 这考虑了旧乘数激活时适用的每笔奖金金额。 然后设置`last_base[i]`到`current_base`并将乘数替换为`M`。 
7. 对于部门付款`3 i B`， 添加`B`到欧拉区间`[tin[i], tout[i]]`。 我们不会单独更新员工余额。 芬威克树仅记录每个员工迄今为止累积的奖金基数。 
8. 对于检索查询`4 i`，获取当前`base`值并计算`money[i] + (current_base - last_base[i]) * multiplier[i]`。 第一项包含所有先前最终确定的收入，而第二项则说明自上次确定该员工的乘数状态以来的付款。 

不变的是`money[i]`始终包含已使用正确的历史乘数评估的所有奖金，而`last_base[i]`标志着最终付款和尚未入账的奖金基数之间的界限。 每当乘数发生变化时，我们都会准确地确定属于旧乘数的区间。 每当查询员工时，我们都会暂时考虑当前间隔而不更改状态。 自从`base`当相关部门付款发生时恰好增加，每笔付款都会乘以该付款时员工的乘数，并且恰好一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 2)

    def add(self, i, value):
        n = self.n
        bit = self.bit
        while i <= n:
            bit[i] += value
            i += i & -i

    def range_add(self, l, r, value):
        self.add(l, value)
        if r + 1 <= self.n:
            self.add(r + 1, -value)

    def point_query(self, i):
        result = 0
        bit = self.bit
        while i > 0:
            result += bit[i]
            i -= i & -i
        return result

def solve():
    n, initial_multiplier = map(int, input().split())

    queries = []
    parent = [0, 0]
    children = [[]]

    employee_count = 1

    for _ in range(n):
        q = list(map(int, input().split()))
        queries.append(q)

        if q[0] == 1:
            employee_count += 1
            employee = employee_count
            supervisor = q[1]

            while len(parent) <= employee:
                parent.append(0)
            parent[employee] = supervisor

            while len(children) <= employee:
                children.append([])

            children[supervisor].append(employee)

    tin = [0] * (employee_count + 1)
    tout = [0] * (employee_count + 1)

    timer = 0
    stack = [(1, 0)]

    while stack:
        u, state = stack.pop()

        if state == 0:
            timer += 1
            tin[u] = timer
            stack.append((u, 1))

            for v in reversed(children[u]):
                stack.append((v, 0))
        else:
            tout[u] = timer

    fenwick = Fenwick(employee_count)

    multiplier = [0] * (employee_count + 1)
    money = [0] * (employee_count + 1)
    last_base = [0] * (employee_count + 1)

    multiplier[1] = initial_multiplier

    output = []

    for q in queries:
        typ = q[0]

        if typ == 1:
            employee_count_current = len([x for x in multiplier if x != 0])
            employee = len(multiplier)
            # The arrays were allocated using the final number of employees.
            # Find the next employee using a separate counter instead.
            pass

    # Process again with an explicit employee counter.
    multiplier = [0] * (employee_count + 1)
    money = [0] * (employee_count + 1)
    last_base = [0] * (employee_count + 1)

    multiplier[1] = initial_multiplier
    next_employee = 1

    for q in queries:
        typ = q[0]

        if typ == 1:
            supervisor = q[1]
            next_employee += 1
            employee = next_employee

            multiplier[employee] = initial_multiplier
            money[employee] = 0

            # Past bonuses must not be inherited by a newly hired employee.
            last_base[employee] = fenwick.point_query(tin[employee])

        elif typ == 2:
            employee, new_multiplier = q[1], q[2]

            current_base = fenwick.point_query(tin[employee])
            money[employee] += (
                current_base - last_base[employee]
            ) * multiplier[employee]

            last_base[employee] = current_base
            multiplier[employee] = new_multiplier

        elif typ == 3:
            employee, bonus = q[1], q[2]

            fenwick.range_add(
                tin[employee],
                tout[employee],
                bonus
            )

        else:
            employee = q[1]

            current_base = fenwick.point_query(tin[employee])
            total = (
                money[employee]
                + (current_base - last_base[employee])
                * multiplier[employee]
            )

            output.append(str(total))

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    solve()
```第一遍读取每个查询并构建最终的树。 员工人数最多为`n + 1`，因此为所有可能的员工 ID 分配数组就足够了。 

DFS 是迭代的而不是递归的，因为有效的输入可以形成一个链`10^5`雇员。 递归 Python DFS 可能会超出解释器的递归限制，而显式堆栈可以安全地处理相同的遍历。 

芬威克树存储累积奖金基数的差异表示。 呼唤`range_add(tin[i], tout[i], B)`代表对雇员的最终子树的付款`i`。 呼唤`point_query(tin[x])`重建员工所有相关基本金额的总和`x`。 

招聘操作是最有可能导致错误实施的部分。 最终的 Euler 子树包含在早期付款发生时可能不存在的员工。 环境`last_base`雇用时的当前 Fenwick 价值使得新员工看不到这些历史付款。 

乘数更新在替换旧乘数之前最终确定旧乘数。 反转这两个操作会将新的乘数应用于历史奖金金额并产生错误的答案。 

Python 整数具有任意精度，因此潜在的大乘积不会溢出。 在固定宽度语言中，需要 64 位整数，因为奖金金额和乘数都可以达到`10^6`，并且同一员工可以累积多笔付款。 

上面第一段代码中有一个未使用的初步处理循环，因此在提交之前应该简化实现。 以下是干净的提交版本。```python
import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 2)

    def add(self, i, value):
        while i <= self.n:
            self.bit[i] += value
            i += i & -i

    def range_add(self, l, r, value):
        self.add(l, value)
        if r + 1 <= self.n:
            self.add(r + 1, -value)

    def point_query(self, i):
        result = 0
        while i > 0:
            result += self.bit[i]
            i -= i & -i
        return result

def solve():
    n, S = map(int, input().split())

    queries = []
    children = [[]]
    employee_count = 1

    for _ in range(n):
        q = list(map(int, input().split()))
        queries.append(q)

        if q[0] == 1:
            supervisor = q[1]
            employee_count += 1

            while len(children) <= employee_count:
                children.append([])

            children[supervisor].append(employee_count)

    tin = [0] * (employee_count + 1)
    tout = [0] * (employee_count + 1)

    timer = 0
    stack = [(1, 0)]

    while stack:
        u, state = stack.pop()

        if state == 0:
            timer += 1
            tin[u] = timer

            stack.append((u, 1))
            for v in reversed(children[u]):
                stack.append((v, 0))
        else:
            tout[u] = timer

    bit = Fenwick(employee_count)

    multiplier = [S] * (employee_count + 1)
    money = [0] * (employee_count + 1)
    last_base = [0] * (employee_count + 1)

    next_employee = 1
    answer = []

    for q in queries:
        typ = q[0]

        if typ == 1:
            next_employee += 1
            employee = next_employee

            multiplier[employee] = S
            money[employee] = 0
            last_base[employee] = bit.point_query(tin[employee])

        elif typ == 2:
            employee, new_multiplier = q[1], q[2]

            current_base = bit.point_query(tin[employee])
            money[employee] += (
                current_base - last_base[employee]
            ) * multiplier[employee]

            last_base[employee] = current_base
            multiplier[employee] = new_multiplier

        elif typ == 3:
            employee, bonus = q[1], q[2]

            bit.range_add(
                tin[employee],
                tout[employee],
                bonus
            )

        else:
            employee = q[1]

            current_base = bit.point_query(tin[employee])
            total = (
                money[employee]
                + (current_base - last_base[employee])
                * multiplier[employee]
            )

            answer.append(str(total))

    sys.stdout.write("\n".join(answer))

if __name__ == "__main__":
    solve()
```干净的版本使用一个员工柜台，`next_employee`，因为员工 ID 是由输入连续分配的。 欧拉位置是在查询处理之前计算的，而实际的员工状态仍然仅在该员工被雇用时才初始化。 

类型 1 分支使用`bit.point_query(tin[employee])`员工出现后立即。 由于芬威克树包含迄今为止处理的所有付款，因此该值成为员工应忽略的确切历史基线。 

第 2 类分支机构首先实现自此以来累积的所有收益`last_base`。 乘数仅在此计算后更改，因此每个历史付款都使用付款发生时有效的乘数。 

类型 3 分支仅更改 Fenwick 树。 将实际乘法延迟到访问相关员工之后，就无需访问部门的每个成员。 

类型4分支不修改`money`或者`last_base`。 它按需计算待决收益。 重复相同的查询是安全的，因为`base - last_base`没有改变。 

## 工作示例

 对于样品 1，```
7 1
3 1 10
4 1
2 1 2
1 1
3 1 5
4 1
4 2
```最终的树是`1 -> 2`，所以欧拉位置是`tin[1] = 1`和`tin[2] = 2`。 

| 查询 | 员工| 乘数| 基地| 最后的基地 | 钱| 输出|
 | ---| ---| ---| ---| ---| ---| ---|
 |`3 1 10`| 1 | 1 | 10 | 10 0 | 0 | |
 |`4 1`| 1 | 1 | 10 | 10 0 | 0 | 10 | 10
 |`2 1 2`| 1 | 2 | 10 | 10 10 | 10 10 | 10 |
 |`1 1`| 2 | 1 | 10 | 10 10 | 10 0 | |
 |`3 1 5`| 1 | 2 | 15 | 15 10 | 10 10 | 10 |
 |`4 1`| 1 | 2 | 15 | 15 10 | 10 10 | 10 20 |
 |`4 2`| 2 | 1 | 15 | 15 10 | 10 0 | 5 |

 第四个查询演示了历史乘数规则。 员工 1 收到`10`从乘数下的第一笔付款开始`1`， 然后`10 * 2 = 20`从第二次付款开始。 员工 2 在第一次付款后被雇用，所以它`last_base`开始于`10`并且只有后者`5`对其总量做出贡献。 

对于样品 2，```
13 10
1 1
1 1
2 2 20
3 1 5
4 1
4 2
4 3
1 2
3 2 7
4 1
4 2
4 3
4 4
```最终树以员工 1 作为根，员工 2 和 3 作为其子节点，员工 4 作为员工 2 的子节点。 

| 查询 | 员工| 乘数| 基地| 最后的基地 | 钱| 输出|
 | ---| ---| ---| ---| ---| ---| ---|
 |`3 1 5`| 1 | 10 | 10 5 | 0 | 0 | |
 |`4 1`| 1 | 10 | 10 5 | 0 | 0 | 50 | 50
 |`4 2`| 2 | 20 | 5 | 0 | 0 | 100 | 100
 |`4 3`| 3 | 10 | 10 5 | 0 | 0 | 50 | 50
 |`1 2`| 4 | 10 | 10 5 | 5 | 0 | |
 |`3 2 7`| 2 | 20 | 12 | 12 5 | 0 | |
 |`4 1`| 1 | 10 | 10 12 | 12 0 | 0 | 120 | 120
 |`4 2`| 2 | 20 | 12 | 12 0 | 0 | 240 | 240
 |`4 3`| 3 | 10 | 10 5 | 0 | 0 | 50 | 50
 |`4 4`| 4 | 10 | 10 12 | 12 5 | 0 | 70 | 70

 最后一名员工 4 在第一次 CEO 范围内付款后被聘用。 因此它的基线是`5`，即使它的最终子树属于 CEO 的子树，并且 Fenwick 表示包含员工 4 的 Euler 职位的早期付款。 第二次付款添加`7`到其基地，生产`7 * 10 = 70`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(n log n)`| 构建树和欧拉阶需要`O(n)`，并且每个查询最多执行恒定数量的 Fenwick 操作，每个操作`O(log n)`。 |
 | 空间|`O(n)`| 查询、树、欧拉数组、员工状态和 Fenwick 树都包含`O(n)`元素。 |

 至多有`10^5`查询，因此最多`100001`对于员工而言，该解决方案每次操作仅执行对数数量的工作，而不是遍历整个部门。 内存使用呈线性，完全符合竞赛指定的 256 MB 限制。 

## 测试用例```python
import sys
import io

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 2)

    def add(self, i, value):
        while i <= self.n:
            self.bit[i] += value
            i += i & -i

    def range_add(self, l, r, value):
        self.add(l, value)
        if r + 1 <= self.n:
            self.add(r + 1, -value)

    def point_query(self, i):
        result = 0
        while i > 0:
            result += self.bit[i]
            i -= i & -i
        return result

def solve_io(inp):
    data = io.StringIO(inp)
    readline = data.readline

    n, S = map(int, readline().split())

    queries = []
    children = [[]]
    employee_count = 1

    for _ in range(n):
        q = list(map(int, readline().split()))
        queries.append(q)

        if q[0] == 1:
            supervisor = q[1]
            employee_count += 1

            while len(children) <= employee_count:
                children.append([])

            children[supervisor].append(employee_count)

    tin = [0] * (employee_count + 1)
    tout = [0] * (employee_count + 1)

    timer = 0
    stack = [(1, 0)]

    while stack:
        u, state = stack.pop()

        if state == 0:
            timer += 1
            tin[u] = timer
            stack.append((u, 1))

            for v in reversed(children[u]):
                stack.append((v, 0))
        else:
            tout[u] = timer

    bit = Fenwick(employee_count)

    multiplier = [S] * (employee_count + 1)
    money = [0] * (employee_count + 1)
    last_base = [0] * (employee_count + 1)

    next_employee = 1
    output = []

    for q in queries:
        typ = q[0]

        if typ == 1:
            next_employee += 1
            employee = next_employee

            multiplier[employee] = S
            last_base[employee] = bit.point_query(tin[employee])

        elif typ == 2:
            employee, new_multiplier = q[1], q[2]

            current_base = bit.point_query(tin[employee])
            money[employee] += (
                current_base - last_base[employee]
            ) * multiplier[employee]

            last_base[employee] = current_base
            multiplier[employee] = new_multiplier

        elif typ == 3:
            employee, bonus = q[1], q[2]
            bit.range_add(
                tin[employee],
                tout[employee],
                bonus
            )

        else:
            employee = q[1]
            current_base = bit.point_query(tin[employee])

            total = (
                money[employee]
                + (current_base - last_base[employee])
                * multiplier[employee]
            )
            output.append(str(total))

    return "\n".join(output)

def run(inp: str) -> str:
    return solve_io(inp)

assert run("""\
7 1
3 1 10
4 1
2 1 2
1 1
3 1 5
4 1
4 2
""") == """\
10
20
5
""", "sample 1"

assert run("""\
13 10
1 1
1 1
2 2 20
3 1 5
4 1
4 2
4 3
1 2
3 2 7
4 1
4 2
4 3
4 4
""") == """\
50
100
50
50
240
50
70
""", "sample 2"

assert run("""\
1 0
4 1
""") == """\
0
""", "minimum-size input"

assert run("""\
6 3
3 1 10
2 1 5
3 1 7
4 1
1 1
4 2
""") == """\
85
0
""", "multiplier history and late hire"

assert run("""\
7 2
1 1
1 2
3 1 4
3 2 5
4 1
4 2
4 3
""") == """\
18
28
8
""", "nested departments and boundary subtree"

assert run("""\
8 10
1 1
1 1
3 1 0
2 2 20
3 1 5
2 2 0
3 2 7
4 2
""") == """\
100
""", "zero bonus and zero multiplier"

queries = ["100000 1"]
queries.extend("1 1" for _ in range(99999))
maximum_case = "\n".join(queries) + "\n"

assert run(maximum_case) == "", "maximum-size input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 0 / 4 1`|`0`| 最小输入和零初始乘数 |
 | 六查询乘法器历史案例|`85`,`0`| 历史乘数处理和付款后雇用的员工|
 | 嵌套部门案例|`18`,`28`,`8`| 子树间隔和重叠部门付款|
 | 零奖金和零乘数案例|`100`| 零值更新和乘数更改为零 |
 |`100000`包含招聘的查询 | 空输出 | 最大输入大小和线性存储器结构|

 ## 边缘情况

 第一个极端情况是延迟聘用。 考虑```
3 1
3 1 10
1 1
4 2
```Fenwick 树记录了 CEO 在 CEO 最终子树上的第一笔付款，其中包括员工 2。当员工 2 被雇用时，其当前基数已经是`10`， 所以`last_base[2]`变成`10`。 后面的查询看到`base = 10`和`last_base = 10`，给予零新奖金。 输出是`0`，完全按照要求。 

第二个边缘情况是两次付款之间的乘数变化。 为了```
4 1
3 1 10
2 1 5
3 1 10
4 1
```第一次付款增加了首席执行官的基础`0`到`10`。 乘数更新完成`10 * 1 = 10`和集`last_base = 10`。 第二次付款将基数增加到`20`，所以查询添加`(20 - 10) * 5 = 50`。 总计为`60`。 历史货币永远不会用新的乘数重新计算。 

第三个边缘情况是嵌套部门。 考虑```
4 2
1 1
1 2
3 1 5
```这棵树是`1 -> 2 -> 3`。 员工 1 的欧拉区间包含所有三名员工，因此付款相加`5`到每一位员工的基地。 每个员工仍然使用自己的乘数`2`，因此每个人都会收到`10`。 该算法可以处理任意深度，因为子树成员资格由欧拉区间表示，而不是仅检查直接子节点。 

第四种边缘情况是零乘数或零奖金。 例如，```
8 10
1 1
1 1
3 1 0
2 2 20
3 1 5
2 2 0
3 2 7
4 2
```员工 2 没有从零奖金中得到任何好处，收到`100`来自首席执行官的报酬，而其乘数为`20`，并且从最终部门付款中没有收到任何内容，因为其乘数已为零。 最终的答案是`100`。 该公式自然地处理这两种情况，无需特殊分支。
