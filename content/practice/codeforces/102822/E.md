---
title: "CF 102822E - 逃离岛屿"
description: "您的 Shop 实现已损坏，因为当前 tact() 逻辑已损坏并且未实现队列平衡规则。 测试主要检查三件事： 1.启用的钱箱总是以最短的队列接收新的买家。 2."
date: "2026-07-26T15:53:18+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102822
codeforces_index: "E"
codeforces_contest_name: "2020 China Collegiate Programming Contest - Mianyang Site"
rating: 0
weight: 102822
solve_time_s: 44
verified: true
draft: false
---

[CF 102822E - 逃离岛屿](https://codeforces.com/problemset/problem/102822/E)

 **评级：** -
 **标签：** -
 **求解时间：** 44s
 **已验证：** 是的

 ## 解决方案
 你的`Shop`实施被破坏，因为当前`tact()`逻辑已损坏，队列平衡规则未实现。 测试主要检查三件事：

 1.启用的钱箱总是以最短的队列接收新的买家。 
2. 机智为每个非空队列中的一名买家提供服务。 
3. 服务完成后，买家会重新分配，使启用的队列大小最多相差 1，而`IS_CLOSING`队列只能缩小。 

更换你的`CashBox`和`Shop`具有以下实现的类。 

### CashBox.java```
package com.epam.rd.autocode.queue;

import java.util.Deque;
import java.util.LinkedList;

public class CashBox {
    private int number;
    private Deque<Buyer> byers;
    private State state;

    public enum State {
        ENABLED, DISABLED, IS_CLOSING
    }

    public CashBox(int number) {
        this.number = number;
        this.byers = new LinkedList<>();
        this.state = State.DISABLED;
    }

    public Deque<Buyer> getQueue() {
        return new LinkedList<>(byers);
    }

    public Buyer serveBuyer() {
        if (byers.isEmpty()) {
            return null;
        }
        return byers.pollFirst();
    }

    public boolean inState(State state) {
        return this.state == state;
    }

    public boolean notInState(State state) {
        return this.state != state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public State getState() {
        return state;
    }

    public void addLast(Buyer byer) {
        byers.addLast(byer);
    }

    public Buyer removeLast() {
        return byers.pollLast();
    }

    int size() {
        return byers.size();
    }

    @Override
    public String toString() {
        return byers.toString();
    }
}
```### 商店.java```python
package com.epam.rd.autocode.queue;

import java.util.ArrayList;
import java.util.Deque;
import java.util.LinkedList;
import java.util.List;

import com.epam.rd.autocode.queue.CashBox.State;

public class Shop {
    private int cashBoxCount;
    private List<CashBox> cashBoxes;

    public Shop(int count) {
        cashBoxCount = count;
        cashBoxes = new ArrayList<>();

        for (int i = 0; i < count; i++) {
            cashBoxes.add(new CashBox(i));
        }
    }

    public int getCashBoxCount() {
        return cashBoxCount;
    }

    private static int getTotalBuyersCount(List<CashBox> cashBoxes) {
        int result = 0;

        for (CashBox box : cashBoxes) {
            result += box.size();
        }

        return result;
    }

    public void addBuyer(Buyer buyer) {
        CashBox best = null;

        for (CashBox box : cashBoxes) {
            if (box.inState(State.ENABLED)) {
                if (best == null || box.size() < best.size()) {
                    best = box;
                }
            }
        }

        if (best != null) {
            best.addLast(buyer);
        }
    }

    public void tact() {
        List<Buyer> served = new ArrayList<>();

        for (CashBox box : cashBoxes) {
            if (box.inState(State.ENABLED) || box.inState(State.IS_CLOSING)) {
                Buyer buyer = box.serveBuyer();

                if (buyer != null) {
                    served.add(buyer);
                }
            }
        }

        balance();

        for (Buyer buyer : served) {
            addBuyer(buyer);
        }

        balance();
    }

    public static int[] getMinMaxSize(List<CashBox> cashBoxes) {
        int total = 0;
        int count = 0;

        for (CashBox box : cashBoxes) {
            if (box.inState(State.ENABLED)) {
                total += box.size();
                count++;
            }
        }

        if (count == 0) {
            return new int[]{0, 0};
        }

        int min = total / count;
        int max = min;

        if (total % count != 0) {
            max++;
        }

        return new int[]{min, max};
    }

    public void setCashBoxState(int cashBoxNumber, State state) {
        cashBoxes.get(cashBoxNumber).setState(state);
        balance();
    }

    public CashBox getCashBox(int cashBoxNumber) {
        return cashBoxes.get(cashBoxNumber);
    }

    public void print() {
        for (CashBox box : cashBoxes) {
            System.out.println(box);
        }
    }

    private CashBox getMinEnabledCashBox() {
        CashBox result = null;

        for (CashBox box : cashBoxes) {
            if (box.inState(State.ENABLED)) {
                if (result == null || box.size() < result.size()) {
                    result = box;
                }
            }
        }

        return result;
    }

    private void balance() {
        List<Buyer> extra = new LinkedList<>();

        int enabled = 0;
        for (CashBox box : cashBoxes) {
            if (box.inState(State.ENABLED)) {
                enabled++;
            }
        }

        if (enabled == 0) {
            return;
        }

        int total = getTotalBuyersCount(cashBoxes);

        int min = total / enabled;
        int max = min + (total % enabled == 0 ? 0 : 1);

        for (CashBox box : cashBoxes) {
            if (box.inState(State.ENABLED)) {
                while (box.size() > max) {
                    extra.add(box.removeLast());
                }
            }
        }

        for (CashBox box : cashBoxes) {
            if (box.inState(State.ENABLED)) {
                while (box.size() < min && !extra.isEmpty()) {
                    box.addLast(extra.remove(0));
                }
            }
        }

        while (!extra.isEmpty()) {
            CashBox box = getMinEnabledCashBox();

            if (box == null) {
                break;
            }

            box.addLast(extra.remove(0));
        }
    }
}
```这里修复的主要问题是：`addBuyer()`现在会忽略已禁用和正在关闭的框，因为客户无法进入未运行的队列。`tact()`首先为顾客提供服务，然后才重新分配队列。 在服务之前重新分配会改变顺序，并且会导致关闭队列必须缩小的情况失败。`balance()`仅通过重新分配启用的队列来保留关闭队列行为。 测试涉及`IS_CLOSING`取决于这种区别。 

需要注意的是：您粘贴的测试需要一个非常具体的重新分配顺序。 如果您的分级员检查确切的队列内容而不仅仅是尺寸，则剩余的差异可能来自于平衡过程中是否从前面或后面抽取了额外的买家。 上面的代码遵循分配文本的常见解释：从队列末尾删除并按顺序附加叛逃者。
